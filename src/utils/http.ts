import service from "./axios";

interface HttpResponse {
    code: number;
    message: string;
    data: any;
}
// 封装get方法
function get(url: string, params?: any): Promise<HttpResponse> {
    return service.get(url, { params })
}

// 封装post方法，支持传入 axios config（例如 signal）
function post(url: string, data?: any, config?: any): Promise<HttpResponse> {
    return service.post(url, data, config)
}

export { get, post };
