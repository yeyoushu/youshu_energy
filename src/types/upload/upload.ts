// types/upload.ts
// 定义文件分片上传相关的类型
export interface FileChunk {
    chunk: Blob
    index: number
    hash: string
    size: number
    progress: number
    status: 'pending' | 'uploading' | 'success' | 'error' | 'cancelled'
}
// 完整文件上传信息
export interface UploadFile {
    id: string
    file: File
    name: string
    size: number
    hash: string
    chunks: FileChunk[]
    totalChunks: number
    progress: number
    // 添加 'merging' 状态以表示分片已上传完成，正在服务器合并中
    status: 'pending' | 'uploading' | 'merging' | 'success' | 'error' | 'paused' | 'cancelled'
    // 累计的重试次数统计，用于在 UI 展示
    totalRetries?: number
    // UI 辅助字段（可选）：当前分片页码与可见分片切片（用于模板分页显示）
    _chunkPage?: number
    _visibleChunks?: FileChunk[]
}
// 上传请求参数
export interface UploadRequest {
    chunk: FileChunk
    file: UploadFile
    controller: AbortController
    // 重试计数（可选），由 UploadManager 管理
    attempts?: number
}
// 上传配置选项
export interface UploadConfig {
    // 分片大小（字节）
    chunkSize: number
    // 最大并发上传数
    maxConcurrent: number
    // 重试次数
    retryCount: number
    // 服务器地址
    serverUrl: string
    // 回调：文件级别进度更新
    onFileProgress?: (file: UploadFile) => void
    // 回调：分片级别进度更新
    onChunkProgress?: (file: UploadFile, chunk: FileChunk) => void
    // 上传成功
    onFileSuccess?: (file: UploadFile) => void
    // 上传出错
    onFileError?: (file: UploadFile, error: any) => void
}