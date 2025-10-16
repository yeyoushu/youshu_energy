import axios from "axios"
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios"
import { ElMessage } from 'element-plus'
const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 5000
})
// 请求拦截器
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // 可以在请求头中添加一些信息，比如token
    // config.headers!['Authorization'] = `Bearer ${token}`
    return config
}, (error: AxiosError) => {
    Promise.reject(error)
    ElMessage.error(error.message)
})
// 响应拦截器
service.interceptors.response.use((response: AxiosResponse) => {
    // console.log('响应拦截器', response)
    if (response.data.code !== 200) {
        ElMessage.error(response.data.message || '请求失败')
        return Promise.reject(new Error('请求失败'))
    } else {

        return response.data
    }

}, (error: AxiosError) => {
    ElMessage.error(error.message)
    return Promise.reject(error)
})
export default service