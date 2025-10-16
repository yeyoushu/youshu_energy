// 封装页码组合式函数传入获取数据方法即可
import { reactive, ref } from "vue";
export const usePagination = (loadData: () => Promise<any>, initPageSize = 10) => {
    const totals = ref<number>(0)
    const pageInfo = reactive({
        page: 1,
        pageSize: initPageSize
    })
    const handleSizeChange = (val: number) => {
        pageInfo.pageSize = val
        loadData()
    }

    const handleCurrentChange = (val: number) => {
        pageInfo.page = val
        loadData()
    }
    const setTotals = (all: number) => {
        totals.value = all;
    }
    // 重置页码
    const resetPagination = () => {
        pageInfo.page = 1;
        pageInfo.pageSize = initPageSize;
    }
    return { totals, pageInfo, handleSizeChange, handleCurrentChange, setTotals, resetPagination }
}