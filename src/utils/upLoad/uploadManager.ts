// utils/uploadManager.ts
// 上传管理器，处理文件分片上传的逻辑
import type { UploadFile, UploadRequest, UploadConfig } from '@/types/upload/upload'
import { FileChunkHandler } from './fileChunk'
import { checkUploadedApi, mergeChunksApi, uploadChunkApi } from '@/api/upload'
export class UploadManager {
    private config: UploadConfig
    private queue: UploadRequest[] = []
    private activeUploads: Map<string, UploadRequest> = new Map()
    private fileChunkHandler: FileChunkHandler

    constructor(config: UploadConfig) {
        // provide sensible defaults and ensure serverUrl exists (fallback to mock host)
        // clone and apply defaults
        const merged: UploadConfig = { ...config }
        // if (!merged.chunkSize) merged.chunkSize = 2 * 1024 * 1024
        // 测试改为默认2kb
        if (!merged.chunkSize) merged.chunkSize = 2 * 1024
        if (!merged.maxConcurrent) merged.maxConcurrent = 3
        if (!merged.retryCount) merged.retryCount = 3
        if (!merged.serverUrl) merged.serverUrl = 'https://www.demo.com'
        this.config = merged
        this.fileChunkHandler = new FileChunkHandler(this.config.chunkSize)
    }

    // 添加文件到上传队列
    async addFile(file: File): Promise<UploadFile> {
        const chunks = this.fileChunkHandler.createFileChunks(file)
        const hash = await this.fileChunkHandler.calculateFileHash(file)

        const uploadFile: UploadFile = {
            id: `${hash}-${Date.now()}`,
            file,
            name: file.name,
            size: file.size,
            hash,
            chunks,
            totalChunks: chunks.length,
            progress: 0,
            status: 'pending',
            totalRetries: 0
        }

        // 初始化分片请求
        this.initializeChunkRequests(uploadFile)
        // 断点续传：检查已上传分片（mock 接口 check）
        try {
            const res = await checkUploadedApi(hash)
            const payload = res?.data || res
            const uploaded = payload?.uploaded || payload?.uploadedChunks || []
            if (Array.isArray(uploaded)) {
                uploadFile.chunks.forEach(c => {
                    if (uploaded.includes(c.index)) {
                        c.status = 'success'
                        c.progress = 100
                    }
                })
                this.updateFileProgress(uploadFile)
            }
        } catch (e) {
            // 忽略检查失败，仍可从头上传
            console.warn('checkUploaded failed, will upload normally', e)
        }
        // Ensure UI reflects the initial progress/state immediately
        try { this.updateFileProgress(uploadFile) } catch (e) { /* ignore */ }
        return uploadFile
    }

    // 初始化分片上传请求
    private initializeChunkRequests(uploadFile: UploadFile): void {
        uploadFile.chunks.forEach(chunk => {
            // ensure each chunk has a known initial state for reactivity
            try { chunk.status = chunk.status || 'pending' } catch (e) { /* ignore */ }
            try { chunk.progress = typeof chunk.progress === 'number' ? chunk.progress : 0 } catch (e) { /* ignore */ }
            const controller = new AbortController()
            const request: UploadRequest = {
                chunk,
                file: uploadFile,
                controller,
                attempts: 0
            }
            this.queue.push(request)
        })
    }

    // 开始上传
    async startUpload(uploadFile: UploadFile): Promise<void> {
        uploadFile.status = 'uploading'
        this.processQueue()
    }

    // 处理上传队列
    private async processQueue(): Promise<void> {
        while (this.queue.length > 0 && this.activeUploads.size < this.config.maxConcurrent) {
            const request = this.queue.shift()!
            this.activeUploads.set(this.getChunkKey(request), request)
            this.uploadChunk(request).finally(() => {
                this.activeUploads.delete(this.getChunkKey(request))
                this.processQueue()
            })
        }
    }

    // 上传单个分片（使用 XMLHttpRequest 以便获取进度和可中止）
    private async uploadChunk(request: UploadRequest): Promise<void> {
        const { chunk, file } = request

        // 如果在队列中已被标记为暂停或取消，则跳过
        if ((request as any).paused || (request as any).cancelled) {
            try { chunk.status = 'pending' } catch (e) { /* ignore */ }
            return
        }

        chunk.status = 'uploading'

        // url 构建由 api 层处理（uploadChunkApi 使用 base serverUrl 或 axios baseURL）

        try {
            const fd = new FormData()
            fd.append('chunk', chunk.chunk)
            fd.append('hash', file.hash)
            fd.append('index', chunk.index.toString())
            fd.append('totalChunks', file.totalChunks.toString())
            fd.append('filename', file.name)

            // axios supports onUploadProgress and signal in config
            const controller = request.controller
            const config: any = {
                onUploadProgress: (ev: ProgressEvent) => {
                    if (ev.lengthComputable) {
                        try { chunk.progress = Math.round((ev.loaded / ev.total) * 100) } catch (e) { /* ignore */ }
                        try { this.updateFileProgress(file) } catch (e) { /* ignore */ }
                        // call chunk progress callback
                        try { this.config.onChunkProgress && this.config.onChunkProgress(file, chunk) } catch (e) { /* ignore */ }
                    }
                },
                // pass AbortController.signal so axios can cancel the request
                signal: controller?.signal
            }

            await uploadChunkApi(fd, config)
            // upload success
            try { chunk.status = 'success'; chunk.progress = 100 } catch (e) { /* ignore */ }
            try { this.updateFileProgress(file) } catch (e) { /* ignore */ }
            try { this.config.onChunkProgress && this.config.onChunkProgress(file, chunk) } catch (e) { /* ignore */ }

        } catch (error) {
            // 判断是否为取消/中止（由 AbortController 或 axios 抛出）
            const isAborted = (request.controller && (request.controller as any).signal && (request.controller as any).signal.aborted)
                || ((error as any)?.code === 'ERR_CANCELED')
                || ((error as any)?.name === 'CanceledError')
                || /canceled/i.test((error && (error as any).message) || '')

            if ((request as any).cancelled || (request as any).paused || isAborted) {
                // 被中止/暂停，不当作失败重试，保持分片为 pending 状态
                try { chunk.status = 'pending' } catch (e) { /* ignore */ }
                try { this.updateFileProgress(file) } catch (e) { /* ignore */ }
                return
            }

            // 非中止错误，标记为 error 并重试
            try { chunk.status = 'error' } catch (e) { /* ignore */ }
            await this.retryUpload(request)
            return
        }
    }

    // 更新文件上传进度：根据每个分片的 progress 平均值计算，能反映进行中的分片进度
    private updateFileProgress(file: UploadFile): void {
        try {
            const total = file.chunks.reduce((acc, c) => acc + (c.progress || 0), 0)
            file.progress = Math.round(total / file.totalChunks)
        } catch (e) {
            try {
                const uploadedChunks = file.chunks.filter(chunk => chunk.status === 'success')
                file.progress = Math.round((uploadedChunks.length / file.totalChunks) * 100)
            } catch (e) {
                file.progress = 0
            }
        }

        const allSuccess = file.chunks.every(c => c.status === 'success')
        if (allSuccess) {
            // 标记为合并中，再调用合并接口；合并完成后会触发 onFileSuccess 回调
            file.status = 'merging'
            try { this.config.onFileProgress && this.config.onFileProgress(file) } catch (e) { /* ignore */ }
            this.mergeChunks(file)
        }
    }

    // 合并分片
    private async mergeChunks(file: UploadFile): Promise<void> {
        try {
            await mergeChunksApi({
                hash: file.hash,
                filename: file.name,
                totalChunks: file.totalChunks
            })
            // 合并成功
            try { file.status = 'success' } catch (e) { /* ignore */ }
            try { this.config.onFileProgress && this.config.onFileProgress(file) } catch (e) { /* ignore */ }
            try { this.config.onFileSuccess && this.config.onFileSuccess(file) } catch (e) { /* ignore */ }
        } catch (error) {
            console.error('Merge error:', error)
            try { file.status = 'error' } catch (e) { /* ignore */ }
            try { this.config.onFileError && this.config.onFileError(file, error) } catch (e) { /* ignore */ }
        }
    }

    // 暂停上传：中止所有正在进行的分片
    pauseAll(): void {
        const filesToUpdate = new Set<UploadFile>()
        for (const req of this.activeUploads.values()) {
            try { (req as any).paused = true } catch (e) { /* ignore */ }
            try { req.chunk.status = 'pending' } catch (e) { /* ignore */ }
            try { filesToUpdate.add(req.file) } catch (e) { /* ignore */ }
            // 立即中止正在进行的请求
            try { req.controller?.abort() } catch (e) { /* ignore */ }
        }
        // remove active uploads tracking; in-flight requests will be left to finish
        // 现在已中止 in-flight 请求，清理 active 列表
        this.activeUploads.clear()
        // refresh UI progress for affected files immediately
        try { for (const f of filesToUpdate) this.updateFileProgress(f) } catch (e) { /* ignore */ }
    }

    // 按文件暂停上传：只中止并移除该文件的分片请求，不影响其他文件
    pauseFile(file: UploadFile): void {
        // 中止正在进行的该文件的分片
        for (const [key, req] of Array.from(this.activeUploads.entries())) {
            if (req.file.id === file.id) {
                try { (req as any).paused = true } catch (e) { /* ignore */ }
                try { req.chunk.status = 'pending' } catch (e) { /* ignore */ }
                // 直接中止正在进行的请求
                try { req.controller?.abort() } catch (e) { /* ignore */ }
                this.activeUploads.delete(key)
            }
        }
        // 从队列中移除该文件的待处理请求
        this.queue = this.queue.filter(req => req.file.id !== file.id)
        // ensure UI reflects pause immediately
        try { this.updateFileProgress(file) } catch (e) { /* ignore */ }
    }

    // 继续上传：重新处理队列
    resumeAll(): void {
        this.processQueue()
    }

    // 按文件继续上传：将该文件处于 pending 的分片重新入队并启动上传
    resumeFile(file: UploadFile): void {
        // 为每个 pending 分片创建请求并加入队列
        file.chunks.forEach(chunk => {
            if (chunk.status === 'pending') {
                const controller = new AbortController()
                const request: UploadRequest = {
                    chunk,
                    file,
                    controller,
                    attempts: 0
                }
                this.queue.push(request)
            }
        })
        // Ensure progress is up-to-date when resuming
        try { this.updateFileProgress(file) } catch (e) { /* ignore */ }
        this.processQueue()
    }

    // 取消文件上传：中止正在进行的分片并移除队列中的请求，设置文件为 cancelled
    cancelFile(file: UploadFile): void {
        // 中止正在进行的该文件的分片
        for (const [key, req] of Array.from(this.activeUploads.entries())) {
            if (req.file.id === file.id) {
                try { (req as any).cancelled = true } catch (e) { /* ignore */ }
                try { req.controller?.abort() } catch (e) { /* ignore */ }
                this.activeUploads.delete(key)
            }
        }
        // 从队列中移除该文件的待处理请求
        this.queue = this.queue.filter(req => req.file.id !== file.id)
        // 更新文件状态
        file.status = 'cancelled'
        file.chunks.forEach(c => {
            if (c.status !== 'success') {
                c.status = 'pending'
                c.progress = 0
            }
        })
        try { this.updateFileProgress(file) } catch (e) { /* ignore */ }
    }

    // 重试单个请求（带次数限制）
    private async retryUpload(request: UploadRequest): Promise<void> {
        request.attempts = (request.attempts || 0) + 1
        // 当 attempts >= retryCount 时视为达到最大重试次数（含当前尝试），停止重试
        if (request.attempts >= (this.config.retryCount || 3)) {
            // 到达最大重试次数，标记为失败
            request.chunk.status = 'error'
            // 通知分片进度变化
            try { this.config.onChunkProgress && this.config.onChunkProgress(request.file, request.chunk) } catch (e) { /* ignore */ }
            // 当某个分片达到失败且无法重试时，视为文件上传出错，触发文件级回调
            try { this.config.onFileError && this.config.onFileError(request.file, { chunk: request.chunk, attempts: request.attempts }) } catch (e) { /* ignore */ }
            return
        }

        // 等待一小段时间后重试（指数退避）
        const wait = 500 * Math.pow(2, request.attempts - 1)
        await new Promise(r => setTimeout(r, wait))

        // 重新创建 controller
        request.controller = new AbortController()
        // 记录文件级别的重试统计
        try {
            request.file.totalRetries = (request.file.totalRetries || 0) + 1
        } catch (e) { /* ignore */ }
        // 将请求重新加入队列头，优先重试
        this.queue.unshift(request)
        this.processQueue()
    }

    private getChunkKey(request: UploadRequest): string {
        return `${request.file.hash}-${request.chunk.index}`
    }
}