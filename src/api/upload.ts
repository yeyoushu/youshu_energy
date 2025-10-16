// src/api/upload.ts
// 使用项目统一的 http 封装（axios），mock 环境会被 src/mock/index.ts 拦截
import { post, get } from '@/utils/http'

// 上传分片（FormData）
export function uploadChunkApi(formData: FormData, config?: any) {
    // 返回 axios 的封装结果（{ code,message,data }）
    return post('/upload', formData, config)
}

// 检查已上传的分片
export function checkUploadedApi(hash: string) {
    return get('/check', { hash })
}

// 合并分片
export function mergeChunksApi(payload: { hash: string; filename: string; totalChunks: number }) {
    return post('/merge', payload)
}
