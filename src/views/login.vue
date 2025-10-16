<template>
  <div class="bg">
    <div class="login">
      <div class="logo">
        <img :src="logo" alt="" width="70px" height="70px" />
        <h1 class="ml">能源管理系统</h1>
      </div>
      <el-form
        label-position="left"
        label-width="80px"
        class="mt"
        ref="formRef"
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item label="用户名" :rules="rules.username" prop="username">
          <el-input
            placeholder="请输入用户名"
            v-model="ruleForm.username"
            prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item label="密码" :rules="rules.password" prop="password">
          <el-input
            type="password"
            show-password
            v-model="ruleForm.password"
            prefix-icon="User"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="handleLogin()"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from "@/assets/logo.png";
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useUserStore } from "@/store/auth";
import { useRouter } from "vue-router";
const userStore = useUserStore();
const router = useRouter();
interface FormState {
  username: string;
  password: string;
}
const formRef = ref<FormInstance>();
const ruleForm: FormState = reactive({
  username: "",
  password: "",
});
const rules = reactive<FormRules<FormState>>({
  username: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
});
const handleLogin = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      await userStore.login(ruleForm);
      router.push("/");
      // console.log("submit!");
    } else {
      // console.log("error submit!");
    }
  });
};
</script>

<style scoped lang="scss">
.bg {
  background-image: url("@/assets/bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  .login {
    width: 500px;
    height: 300px;
    padding: 50px;
    text-align: center;
    position: absolute;
    top: 50%;
    margin-top: -200px;
    left: 15%;
    box-shadow: 0 0 10px 10px #f4f4f4;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      h1 {
        color: rgb(14, 53, 148);
      }
    }
  }
}
</style>
