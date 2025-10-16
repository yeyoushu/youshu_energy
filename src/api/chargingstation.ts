import { post, get } from "@/utils/http"

const Api = {
    StationList: "/stationList",
    StationEdit: "/station/edit",
    StationDelete: "/station/delete",
    RevenueChart: "/revenueChart",
    RevenueList: "/revenueList",
    currentList: "/currentList",


} as const;
interface ListType {
    page: number,
    pageSize: number,
    name?: string,
    id?: string,
    status: number
}
interface RevenueType {
    page: number,
    pageSize: number,
    name: string
}
export const listApi = (data: ListType) => post(Api.StationList, data);

export const editApi = (data: any) => post(Api.StationEdit, data);

export const deleteApi = (data: { id: string }) => post(Api.StationDelete, data);

export const chartApi = () => get(Api.RevenueChart)

export const revenueApi = (data: RevenueType) => post(Api.RevenueList, data);

export const currentApi = () => post(Api.currentList)