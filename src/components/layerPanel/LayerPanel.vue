<template>
  <div class="layer-panel">
    <el-card
      v-if="layers && layers.length"
      class="layer-card"
      v-for="layer in layers"
      :key="layer.id"
      :body-style="{ padding: '8px' }"
    >
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div style="display: flex; gap: 8px; align-items: center">
          <el-switch
            :model-value="layer.visible"
            @change="onVisibilityChange(layer.id, $event)"
          />
          <div>
            <div style="font-weight: 600">{{ layer.title || layer.id }}</div>
            <div style="font-size: 12px; color: #666">{{ layer.id }}</div>
          </div>
        </div>
        <div style="display: flex; gap: 6px; align-items: center">
          <el-button size="small" @click="$emit('toggle', layer.id)"
            >切换</el-button
          >
          <el-button size="small" type="danger" @click="confirmRemove(layer.id)"
            >移除</el-button
          >
        </div>
      </div>
    </el-card>
    <div v-else style="color: #888; padding: 8px">无可控图层</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, toRef } from "vue";
import { ElMessageBox } from "element-plus";

const props = defineProps<{
  layers: Array<{ id: string; title?: string; visible?: boolean }>;
}>();
// 使用 toRef 确保对 props.layers 的引用保持响应性
const layers = toRef(props, "layers");
console.log(layers, "layers");

const emit = defineEmits<{
  (e: "toggle", id: string): void;
  (e: "remove", id: string): void;
  (e: "visibility-change", payload: { id: string; visible: boolean }): void;
}>();

function onVisibilityChange(id: string, val: boolean) {
  emit("visibility-change", { id, visible: val });
}

/**
 * 当用户点击移除按钮时弹出确认对话框，确认后才发出 remove 事件
 * 说明：使用 Element Plus 的 MessageBox.confirm 提示用户二次确认，避免误删。
 */
function confirmRemove(id: string) {
  ElMessageBox.confirm("确定要移除该图层吗？此操作不可撤销。", "确认移除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      emit("remove", id);
    })
    .catch(() => {
      // 取消删除，无操作
    });
}
</script>

<style scoped>
.layer-panel {
  position: absolute;
  right: 16px;
  top: 120px;
  width: 240px;
  z-index: 1000;
}
.layer-card {
  margin-bottom: 8px;
}
</style>
