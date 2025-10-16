import { get } from "@/utils/http"

const Api = {
    AlarmList: "/alarmList"
} as const

export const alarmListApi = () => get(Api.AlarmList)

