// 运营管理接口
import { post, get } from "@/utils/http";

const Api = {
    batchDelete: "/batchDelete",
    cityList: "/cityList",
}

export const batchDeleteApi = (order: string[]) => post(Api.batchDelete, { order });


// 获取城市列表

export const cityListApi = () => get(Api.cityList);