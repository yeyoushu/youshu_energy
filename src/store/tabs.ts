import { defineStore } from "pinia";
import { ref } from "vue"
import type { menuItem } from "@/types/user"
export const useTabsStore = defineStore("tabs", () => {
    const tabs = ref<menuItem[]>([]);
    // 当前选中的tab
    const currentTab = ref<{ name: string, url: string }>({ name: "", url: "" })
    //添加tab页签
    const addTab = (name: string, url: string, icon: string) => {
        if (!tabs.value.some((tab) => tab.name === name)) {
            tabs.value.push({ name, url, icon })
        }
    }
    //    数据联动导航切换
    const setCurrentTab = (name: string, url: string) => {
        currentTab.value = { name, url }
    }

    const removeTab = (name: string) => {
        //如果删除的是高亮的
        if (currentTab.value.name === name) {
            const currentIndex = tabs.value.findIndex(tab => tab.name === name);
            if (currentIndex != 0) {
                currentTab.value = tabs.value[currentIndex - 1]
            } else {
                return
            }

        }

        tabs.value = tabs.value.filter(tab => tab.name !== name)
    }


    return { tabs, addTab, currentTab, setCurrentTab, removeTab }

})
