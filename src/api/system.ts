import { post } from "@/utils/http"
const Api = {
    auth: "/userAuth",
    setAuth: "/setAuth"
} as const


export const getAuthApi = (pageAuthority: string) => post(Api.auth, { pageAuthority })
export const setAuthApi = (account: string, btnList: string[], pageList: string[]) => post(Api.setAuth, { account, btnList, pageList })