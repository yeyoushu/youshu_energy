<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入订单号" v-model="searchParams.orderNo" />
      </el-col>
      <el-col :span="6">
        <el-select placeholder="订单状态" v-model="searchParams.status">
          <el-option label="全部" :value="1"></el-option>
          <el-option label="进行中" :value="2"></el-option>
          <el-option label="已完成" :value="3"></el-option>
          <el-option label="异常" :value="4"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="设备编号" v-model="searchParams.no" />
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="loadData">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-col>
      <el-col :span="6" class="mt">
        <el-input placeholder="请输入站点名称" v-model="searchParams.name" />
      </el-col>
      <el-col :span="6" class="mt">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="/"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="handleChange"
          value-format="YYYY-MM-DD"
        />
      </el-col>
    </el-row>
  </el-card>
  <el-card class="mt">
    <el-button
      type="danger"
      :disabled="!selectionList.length"
      @click="handleBatchDelete(1)"
      >批量删除</el-button
    >
    <el-button
      type="primary"
      icon="Download"
      :disabled="!selectionList.length"
      @click="handleExportToExcel"
      >导出订单数据到Excel</el-button
    >
    <div class="file-upload mt">
      <el-upload
        :auto-upload="false"
        :on-change="handleFileChange"
        :show-file-list="false"
        :multiple="false"
      >
        <el-button type="primary">选择大文件</el-button>
      </el-upload>

      <div v-for="file in uploadFiles" :key="file.id" class="file-item">
        <div class="file-info">
          <div class="file-main">
            <span class="file-name">{{ file.name }}</span>
            <el-button v-if="file.status === 'error'" @click="retryFile(file)">
              重试
            </el-button>
            <el-button
              type="danger"
              v-if="file.status !== 'success' && file.status !== 'cancelled'"
              @click="cancelUpload(file)"
            >
              取消
            </el-button>
          </div>

          <el-progress
            :percentage="file.progress"
            :status="
              file.status === 'error'
                ? 'exception'
                : file.status === 'success'
                ? 'success'
                : ''
            "
          />
          <div class="file-stats">
            <small
              >失败分片:
              {{ file.chunks.filter((c) => c.status === "error").length }} ·
              重试次数: {{ file.totalRetries || 0 }}</small
            >
          </div>

          <div class="chunk-list" v-if="file.chunks && file.chunks.length">
            <small>分片进度:</small>
            <div class="chunk-tags">
              <el-tag
                v-for="ch in file._visibleChunks"
                :key="ch.index"
                :type="getChunkTagType(ch)"
                class="ml-5"
              >
                {{ ch.index }}: {{ ch.progress }}%
              </el-tag>
            </div>
            <div
              class="chunk-pagination"
              v-if="file.chunks.length > chunkPageSize"
            >
              <el-pagination
                :current-page.sync="file._chunkPage"
                :page-size="chunkPageSize"
                :total="file.chunks.length"
                layout="prev, pager, next"
                @current-change="(p: number) => updateVisibleChunks(file, p)"
              />
            </div>
          </div>

          <div class="file-actions">
            <el-button
              v-if="file.status === 'paused'"
              @click="resumeUpload(file)"
            >
              继续
            </el-button>
            <el-button
              v-else-if="file.status === 'uploading'"
              @click="pauseUpload(file)"
            >
              暂停
            </el-button>
            <el-button v-if="file.status === 'error'" @click="retryFile(file)">
              重试
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-card>
  <el-card class="mt">
    <el-table
      :data="dataList"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column label="订单号" prop="orderNo"></el-table-column>
      <el-table-column label="设备编号" prop="equipmentNo"></el-table-column>
      <el-table-column label="订单日期" prop="date"></el-table-column>
      <el-table-column label="开始时间" prop="startTime"></el-table-column>
      <el-table-column label="结束时间" prop="endTime"></el-table-column>
      <el-table-column label="金额" prop="money"></el-table-column>
      <el-table-column label="支付方式" prop="pay"></el-table-column>
      <el-table-column label="订单状态" prop="status">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.status == 2">进行中</el-tag>
          <el-tag type="primary" v-else-if="scope.row.status == 3"
            >已完成</el-tag
          >
          <el-tag type="warning" v-else-if="scope.row.status == 4">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleDetail(scope.row.orderNo)"
            >详情</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="handleBatchDelete(scope.row.orderNo)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="fr mt mb"
      v-model:current-page="pageInfo.page"
      v-model:page-size="pageInfo.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="sizes, prev, pager, next, jumper,total"
      :total="totals"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
    />
  </el-card>
</template>

<script setup lang="ts">
/**
 * Orders.vue - 大文件分片上传示例
 *
 * 功能说明：
 * - 选择本地大文件后，文件会被切片并并发上传。
 * - 显示每个文件的整体进度与分片进度（每个分片的 %）。
 * - 支持暂停 / 继续 / 取消 / 重试。
 * - 支持断点续传（通过向后端 check 已上传分片实现）。
 *
 * 使用说明：
 * 1. 点击“选择大文件”，选中文件后会自动计算分片与 hash（抽样）。
 * 2. 上传过程中可点击暂停/继续/取消，失败的分片可点击重试。
 * 3. 分片数量很多时，分片进度会分页展示，默认每页显示 20 个分片标签。
 */
import { ref, watch } from "vue";
import { useHttp } from "@/hooks/useHttp";
import { batchDeleteApi } from "@/api/operation";
import { useRouter, useRoute } from "vue-router";
import { useTabsStore } from "@/store/tabs";
import { ElMessage } from "element-plus";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { UploadManager } from "@/utils/upLoad/uploadManager";
import { reactive } from "vue";
import type { UploadFile } from "@/types/upload/upload";
interface SearchType {
  orderNo: string;
  status: number;
  no: string;
  name: string;
  startDate: string;
  endDate: string;
}
// 定义表格数据类型
interface SelectionListType {
  orderNo: string;
  equipmentNo: string;
  date: string;
  startTime: string;
  endTime: string;
  money: string;
  pay: string;
  status: number;
}
const date = ref();

const searchParams = ref<SearchType>({
  orderNo: "",
  status: 1,
  no: "",
  name: "",
  startDate: "",
  endDate: "",
});
// 利用解构赋值借用封装的组合式函数完善表格功能
const {
  dataList,
  loading,
  totals,
  pageInfo,
  loadData,
  handleSizeChange,
  handleCurrentChange,
  resetPagination,
} = useHttp<SelectionListType>("/orderList", searchParams);
const handleChange = (val: string[]) => {
  searchParams.value.startDate = val[0];
  searchParams.value.endDate = val[1];
  console.log(val, "日期");
};
const handleReset = () => {
  date.value = "";
  searchParams.value = {
    orderNo: "",
    status: 1,
    no: "",
    name: "",
    startDate: "",
    endDate: "",
  };
  resetPagination();
};
// 多选和勾选数据
const selectionList = ref<SelectionListType[]>([]);
const handleSelectionChange = (selection: SelectionListType[]) => {
  selectionList.value = selection;
};

const handleBatchDelete = async (res: any) => {
  const order = ref<any[]>([]);
  if (res === 1) {
    if (selectionList.value.length === 0) {
      return;
    }
    order.value = selectionList.value.map((item) => item.orderNo);
    console.log(order.value, "order");
  } else {
    order.value.push(res);
  }
  try {
    const res = await batchDeleteApi(order.value);
    if (res.code) {
      ElMessage({
        message: res.data,
        type: "success",
      });
      loadData();
    }
  } catch (error) {
    console.log(error);
  }
};
const route = useRoute();
watch(
  () => route.name,
  (to, from) => {
    console.log("from", from);
    if (to == "orders" && from != "operations_detail") {
      // console.log("1", 1);
      loadData();
    }
  }
);
const router = useRouter();
const tabsStore = useTabsStore();
const { addTab, setCurrentTab } = tabsStore;
// 订单详情
const handleDetail = (orderNo: string) => {
  addTab("订单详情", "/operations/detail?orderNo=" + orderNo, "Share");
  setCurrentTab("订单详情", "/operations/detail?orderNo=" + orderNo);
  router.push("/operations/detail?orderNo=" + orderNo);
  console.log("查看订单详情:", orderNo);
};
// 借用XLSX和file-saver实现导出Excel功能
const handleExportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(selectionList.value); //把数据转成工作表格式
  const wb = XLSX.utils.book_new(); //创建新的工作簿
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); //工作簿加到工作表中
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, `充电站订单数据.xlsx`);
};

// 大文件上传处理
const uploadFiles = ref<UploadFile[]>([]);
const uploadManager = new UploadManager({
  // chunkSize: 2 * 1024 * 1024,
  // 测试改完默认2kb
  chunkSize: 2 * 1024,
  maxConcurrent: 3,
  retryCount: 3,
  serverUrl: import.meta.env.VITE_UPLOAD_URL || "https://www.demo.com",
  // 回调：当文件或分片进度更新时触发，用于更新 UI
  onFileProgress: (f) => {
    const idx = uploadFiles.value.findIndex((x) => x.id === f.id);
    if (idx !== -1) uploadFiles.value[idx].progress = f.progress;
  },
  onChunkProgress: (f, c) => {
    const file = uploadFiles.value.find((x) => x.id === f.id);
    if (!file) return;
    const chunk = file.chunks.find((ch) => ch.index === c.index);
    if (chunk) chunk.progress = c.progress;
  },
  onFileSuccess: (f) => {
    const file = uploadFiles.value.find((x) => x.id === f.id);
    if (file) file.status = "success";
  },
  onFileError: (f, err) => {
    const file = uploadFiles.value.find((x) => x.id === f.id);
    if (file) file.status = "error";
    console.error("file upload error", err);
  },
});

const handleFileChange = async (file: File) => {
  try {
    // el-upload 的 on-change 回调传入的是 UploadRawFile 或事件，确保我们得到原生 File
    const nativeFile = (file as any).raw || file;
    const uploadFile = await uploadManager.addFile(nativeFile);
    // wrap with reactive to ensure template observes mutations immediately
    const reactiveFile = reactive(uploadFile) as UploadFile;
    // 初始化分页/可见分片字段，用于 UI 分页显示分片标签
    (reactiveFile as any)._chunkPage = 1;
    (reactiveFile as any)._visibleChunks = reactiveFile.chunks.slice(
      0,
      chunkPageSize
    );
    uploadFiles.value.push(reactiveFile);
    // 计算初始进度（如果有分片已经上传成功）
    try {
      const uploaded = reactiveFile.chunks.filter(
        (c) => c.status === "success"
      ).length;
      reactiveFile.progress = Math.round(
        (uploaded / reactiveFile.totalChunks) * 100
      );
    } catch (e) {
      /* ignore */
    }
    // 立即开始上传
    await uploadManager.startUpload(reactiveFile);
  } catch (error) {
    ElMessage.error("文件添加失败");
  }
};

// 分片分页大小（UI 控制）
const chunkPageSize = 20;

// 根据分片状态返回 Element Plus tag 的 type（颜色）
const getChunkTagType = (ch: any) => {
  switch (ch.status) {
    case "success":
      return "success";
    case "uploading":
      return "info";
    case "error":
      return "danger";
    case "pending":
      return "gray";
    case "cancelled":
      return "warning";
    case "merging":
      return "warning";
    default:
      return "info";
  }
};

// 更新 per-file 可见分片（分页）
const updateVisibleChunks = (file: any, page: number) => {
  const start = (page - 1) * chunkPageSize;
  const end = start + chunkPageSize;
  file._chunkPage = page;
  file._visibleChunks = file.chunks.slice(start, end);
};

const pauseUpload = (file: UploadFile) => {
  // 标记状态并让 UploadManager 中止正在上传的分片
  file.status = "paused";
  uploadManager.pauseFile(file);
};

const resumeUpload = (file: UploadFile) => {
  file.status = "uploading";
  // 恢复该文件的上传任务
  uploadManager.resumeFile(file);
  // 确保为该文件重新启动上传队列
  uploadManager.startUpload(file);
};

const retryFile = async (file: UploadFile) => {
  // 将错误的分片重新加入队列并重新开始上传
  file.chunks.forEach((c) => {
    if (c.status === "error") {
      c.status = "pending";
      c.progress = 0;
    }
  });
  file.status = "uploading";
  await uploadManager.startUpload(file);
};

const cancelUpload = (file: UploadFile) => {
  uploadManager.cancelFile(file);
  // 从列表中移除
  const idx = uploadFiles.value.findIndex((f) => f.id === file.id);
  if (idx > -1) uploadFiles.value.splice(idx, 1);
};

// Removed unused helpers to satisfy linting
</script>

<style scoped></style>
