// 封装组合式函数解决chart图表resize窗口适配监听和组件卸载时注销问题
import type { Ref } from "vue";
import { ref, onMounted, onBeforeUnmount, markRaw } from "vue"
import * as echarts from "echarts";
// 封装组合式函数解决chart图表resize窗口适配监听和组件卸载时注销问题
export function useChart(chartRef: Ref<HTMLElement | null>, setChartData: any) {
    const chartInstance = ref<echarts.ECharts | null>(null);

    const initChart = async () => {
        if (chartRef.value) {
            // echarts自带响应式更新使用markRaw取消vue响应式防止响应式冲突
            chartInstance.value = markRaw(echarts.init(chartRef.value));
            const options = await setChartData()
            chartInstance.value.setOption(options);
        }
    };
    const resizeChart = () => {
        chartInstance.value?.resize();
    };
    onMounted(() => {
        initChart();
        window.addEventListener('resize', resizeChart);
    });
    onBeforeUnmount(() => {
        // 释放窗口事件监听
        window.removeEventListener('resize', resizeChart);
        // 释放图表实例
        if (chartInstance.value) {
            chartInstance.value?.dispose();
        }

    });
}


