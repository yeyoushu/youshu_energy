<template>
  <el-row :gutter="20">
    <el-col :span="18">
      <el-card>
        <MapContainer :refreshToken="refreshToken" />
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="des">
        <div>1.累计充电站数量：<el-text type="primary">34个</el-text></div>
        <div>
          2.单省份最多充电桩：<el-text type="primary">北京(4个)</el-text>
        </div>
        <div>3.充电站遍及省份：<el-text type="primary">14个</el-text></div>
        <div>4.暂无充电站省份：<el-text type="primary">22个</el-text></div>
        <div>5.累计充电站：<el-text type="primary">北京(4个)</el-text></div>
        <div>
          6.单日营收最高：<el-text type="primary">北京西单充电站</el-text>
        </div>
        <div>
          7.单日营收最低：<el-text type="primary">南宁青秀山充电站</el-text>
        </div>
        <div>
          8.故障率最高：<el-text type="primary">兰州黄河桥充电站</el-text>
        </div>
      </el-card>
      <el-card class="mt">
        <template #header>
          <div class="card-header">
            <h3>新增站点地图</h3>
          </div>
        </template>
        <el-form
          :model="form"
          :rules="rules"
          style="max-width: 600px"
          label-width="100px"
          ref="formRef"
        >
          <el-form-item label="站点名称：" prop="name">
            <el-input placeholder="请输入站点名称" v-model="form.name" />
          </el-form-item>
          <el-form-item label="站点地址" prop="region">
            <el-input placeholder="请输入站点地址" v-model="form.region" />
          </el-form-item>
          <el-form-item label="经度：" prop="location1">
            <el-input placeholder="请输入经度" v-model="form.location1" />
          </el-form-item>
          <el-form-item label="维度：" prop="location2">
            <el-input placeholder="请输入维度" v-model="form.location2" />
          </el-form-item>
          <el-form-item label="立即使用：" prop="now">
            <el-switch v-model="form.now" />
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input
              placeholder="请输入备注"
              type="textarea"
              v-model="form.remarks"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">创建</el-button>
            <el-button>清空</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import MapContainer from "@/components/map/MapContain.vue";
import { mapParamsApi } from "@/api/map";
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
const formRef = ref<FormInstance>();
const refreshToken = ref<number>(0);
import type { FormRules, FormInstance } from "element-plus";

interface RowType {
  name: string;
  region: string;
  location1: string;
  location2: string;
  now: string | boolean;
  remarks: string;
  title: string;
}
const form = ref<RowType>({
  name: "",
  region: "",
  location1: "",
  location2: "",
  now: "",
  remarks: "",
  title: "",
});
const rules = reactive<FormRules<RowType>>({
  name: [{ required: true, message: "请输入站点名称", trigger: "blur" }],
  region: [{ required: true, message: "请输入站点地址", trigger: "blur" }],
  location1: [{ required: true, message: "请输入经度", trigger: "blur" }],
  location2: [{ required: true, message: "请输入维度", trigger: "blur" }],
});

const handleSubmit = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      form.value.title = form.value.name;
      const res = await mapParamsApi(form.value);
      console.log("res", res);

      if (res.code == 200) {
        form.value = {
          name: "",
          region: "",
          location1: "",
          location2: "",
          now: "",
          remarks: "",
          title: "",
        };
        // 创建成功后自增 refreshToken 以通知子组件重新加载标注
        refreshToken.value += 1;
        ElMessage({
          message: res.data,
          type: "success",
        });
      }
    } else {
      console.log("error submit!!");
      // 验证失败，直接结束回调
    }
  });
};
</script>
<style scoped lang="scss">
.des {
  line-height: 35px;
}
</style>
