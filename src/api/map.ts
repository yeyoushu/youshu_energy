import { post } from "@/utils/http";
const Api = {
    MapList: "/mapList",
    params: "/addStation"
} as const;

export const mapListApi = () => post(Api.MapList);

export const mapParamsApi = (data: any) => post(Api.params, data);