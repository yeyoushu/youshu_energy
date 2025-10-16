<template>
  <div>
    <el-container>
      <el-aside width="200px"><Menu></Menu></el-aside>
      <el-container>
        <el-header><TopHeader /></el-header>
        <el-main>
          <TabsLayout></TabsLayout>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Menu from "@/components/navMenu/menu.vue";
import TopHeader from "@/components/TopHeader/TopHeader.vue";
import TabsLayout from "@/layouts/TabsLayout.vue";
</script>

<style scoped lang="scss">
:deep(.el-aside) {
  height: 100vh;
  background-color: #ffffff;
  box-shadow: 10px 0 8px -2px rgba(0, 0, 0, 0.2);
}
:deep(.el-header) {
  padding: 0;
}
:deep(.el-main) {
  height: 85vh;
  overflow: auto;
}
</style>
