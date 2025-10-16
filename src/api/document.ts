import { get } from "@/utils/http"

const Api = {
    document: "/document"
} as const

export const typeListApi = () => get(Api.document)