import { post } from "@/utils/http";
const Api = {
    LOGIN: "/login",
} as const;

interface LoginData {
    username: string;
    password: string;
}
function loginApi(data: LoginData): Promise<any> {
    return post(Api.LOGIN, data);
}
export {
    loginApi
}