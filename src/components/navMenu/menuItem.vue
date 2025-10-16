<template>
  <el-sub-menu v-if="item.children" :index="item.url">
    <template #title>
      <el-icon>
        <component :is="item.icon"></component>
      </el-icon>
      <span>{{ item.name }}</span>
    </template>
    <my-menu
      v-for="child in item.children"
      :key="child.url"
      :item="child"
    ></my-menu>
  </el-sub-menu>
  <el-menu-item
    v-else
    :index="item.url"
    @click="add(item.name, item.url, item.icon)"
    v-show="!(item.name == '订单详情')"
  >
    <el-icon>
      <component :is="item.icon"></component>
    </el-icon>
    <span>{{ item.name }}</span>
  </el-menu-item>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { menuItem as MenuItemType } from "@/types/user/index";
import { useTabsStore } from "@/store/tabs";
export default defineComponent({
  name: "MyMenu",
  props: {
    item: {
      type: Object as PropType<MenuItemType>,
      required: true,
    },
  },
  setup() {
    const tabsStore = useTabsStore();
    const { addTab, setCurrentTab } = tabsStore;
    const add = (name: string, url: string, icon: any) => {
      addTab(name, url, icon);
      setCurrentTab(name, url);
    };
    return { add };
  },
});
</script>

<style scoped lang="scss">
.is-active {
  background-color: rgb(34, 136, 255);
  color: #fff !important;
  div {
    span {
      color: #fff;
    }
  }
}
.el-menu-item:hover {
  background-color: rgb(34, 136, 255) !important;
  color: #fff !important ;
}
:deep(.el-sub-menu__title:hover) {
  background-color: rgb(34, 136, 255) !important;
  color: #fff !important ;
}
</style>
