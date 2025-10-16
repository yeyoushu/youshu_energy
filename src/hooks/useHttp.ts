// 封装查询表格加分页组合式函数

import { onMounted, reactive, ref, unref } from "vue"
import { post } from "@/utils/http"

export function useHttp<T>(url: string, initialParams: any) {
    const dataList = ref<T[]>([]); //用来存表格的
    const loading = ref<boolean>(false); //用来控制加载中
    const totals = ref<number>(0); //用来存总条数
    const pageInfo = reactive({
        page: 1,
        pageSize: 10
    }); //用来存分页信息
    // 获取表格数据方法 unref取原始值
    const loadData = async () => {
        loading.value = true;
        const { data: { list, total } } = await post(url, { ...unref(initialParams), ...pageInfo })
        dataList.value = list;
        totals.value = total;
        try {

        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    }
    onMounted(() => {
        loadData()
    })
    //   监听分页变化
    const handleSizeChange = (size: number) => {
        pageInfo.pageSize = size;
        loadData();
    }
    // 监听页码变化
    const handleCurrentChange = (page: number) => {
        pageInfo.page = page;
        loadData();
    }
    // 重置分页变化
    const resetPagination = () => {
        pageInfo.page = 1;
        pageInfo.pageSize = 10;
        loadData();
    }
    return {
        dataList,
        loading,
        totals,
        pageInfo,
        loadData,
        handleSizeChange,
        handleCurrentChange,
        resetPagination
    }
}