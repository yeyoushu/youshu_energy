import { get } from "@/utils/http"

const Api = {
    ChartData: "/chartData",
    ChartData2: "/chartData2",
    ChartData3: "/chartData3",
} as const;

function chartDataApi() {
    return get(Api.ChartData)
}

function chartData2Api() {
    return get(Api.ChartData2)
}
function chartData3Api() {
    return get(Api.ChartData3)
}

export { chartDataApi, chartData2Api, chartData3Api }