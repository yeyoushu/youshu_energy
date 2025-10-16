// utils/fileChunk.ts
// 文件分片处理相关的工具函数
import SparkMD5 from 'spark-md5'
import type { FileChunk } from '@/types/upload/upload'

export class FileChunkHandler {
    private chunkSize: number
    // //  默认分片大小 2MB
    // constructor(chunkSize: number = 2 * 1024 * 1024) {
    //     this.chunkSize = chunkSize
    // }
    //  测试改完默认2kb
    constructor(chunkSize: number) {
        this.chunkSize = chunkSize
    }
    // 文件切片
    createFileChunks(file: File): FileChunk[] {
        const chunks: FileChunk[] = []
        let current = 0

        while (current < file.size) {
            const chunk = file.slice(current, current + this.chunkSize)
            chunks.push({
                chunk,
                index: chunks.length,
                hash: '',
                size: chunk.size,
                progress: 0,
                status: 'pending'
            })
            current += this.chunkSize
        }

        return chunks
    }

    // 计算文件Hash (抽样计算)
    async calculateFileHash(file: File): Promise<string> {
        return new Promise((resolve) => {
            const spark = new SparkMD5.ArrayBuffer()
            const reader = new FileReader()
            const size = file.size
            const chunkSize = this.chunkSize

            // 抽样计算提高性能
            const samples: Blob[] = []
            let offset = 0

            while (offset < size) {
                const end = Math.min(offset + chunkSize, size)
                samples.push(file.slice(offset, end))
                offset += chunkSize * 10 // 每10个分片取一个样本
            }

            let processed = 0
            const processNext = () => {
                if (processed >= samples.length) {
                    resolve(spark.end())
                    return
                }

                reader.readAsArrayBuffer(samples[processed])
                reader.onload = (e) => {
                    spark.append(e.target?.result as ArrayBuffer)
                    processed++
                    processNext()
                }
            }

            processNext()
        })
    }
}