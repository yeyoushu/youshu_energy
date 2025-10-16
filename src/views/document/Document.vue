<template>
  <el-card>
    <div class="mt">
      <span class="title">文章类型：</span>
      <el-check-tag
        :type="currentIndex[0] == -1 ? 'primary' : 'info'"
        class="mr"
        @click="handleSelect(-1, 0, '')"
        checked
        >全部</el-check-tag
      >
      <el-tag
        :type="currentIndex[0] == index ? 'primary' : 'info'"
        class="mr"
        v-for="(item, index) in typeList.type"
        :key="item"
        @click="handleSelect(index, 0, item)"
        >{{ item }}</el-tag
      >
    </div>
    <div class="mt">
      <span class="title">重要程度：</span>
      <el-tag
        :type="currentIndex[1] == -1 ? 'primary' : 'info'"
        class="mr"
        @click="handleSelect(-1, 1, '')"
        >全部</el-tag
      >
      <el-tag
        :type="currentIndex[1] == index ? 'primary' : 'info'"
        class="mr"
        v-for="(item, index) in typeList.important"
        :key="item"
        @click="handleSelect(index, 1, item)"
        >{{ item }}</el-tag
      >
    </div>
    <div class="mt">
      <span class="title">发布渠道：</span>
      <el-tag
        :type="currentIndex[2] == -1 ? 'primary' : 'info'"
        class="mr"
        @click="handleSelect(-1, 2, '')"
        >全部</el-tag
      >
      <el-tag
        :type="currentIndex[2] == index ? 'primary' : 'info'"
        class="mr"
        v-for="(item, index) in typeList.publish"
        :key="item"
        @click="handleSelect(index, 2, item)"
        >{{ item }}</el-tag
      >
    </div>
    <el-divider />
    <div class="mt">
      <span class="title">已选:</span>
      <el-tag
        disable-transitions
        type="success"
        class="ml"
        closable
        v-for="(item, index) in selectedList"
        :key="index"
        @close="handleClose(item.num)"
        >{{ item.name }}</el-tag
      >
    </div>
  </el-card>
  <el-button type="primary" class="mt mb" @click="exportToHtml"
    >导出富文本到HTML文件</el-button
  >
  <Editor
    v-model="editorContent"
    api-key="xvbamfm2vokka8qoim9r801qtdlldskjschd51yha7zhuusp"
    :init="{
      language: 'zh_CN',
      plugins: 'lists link image table code help wordcount',
    }"
  />
  <el-button
    type="primary"
    @click="handleSubmit"
    class="mt"
    v-permission="'user'"
    >提交文章内容</el-button
  >
</template>

<script setup lang="ts">
import { typeListApi } from "@/api/document";
import { onMounted, ref } from "vue";
import Editor from "@tinymce/tinymce-vue";
interface ListType {
  type: string[];
  important: string[];
  publish: string[];
}
interface SelectType {
  name: string;
  num: number;
}
const typeList = ref<ListType>({ type: [], important: [], publish: [] });
const currentIndex = ref([-1, -1, -1]);
const selectedList = ref<SelectType[]>([]); //[{name:"招商类",num:0},{name:"二级",num:1}]
// 关闭已选标签
const handleClose = (num: number) => {
  selectedList.value = selectedList.value.filter((item) => item.num !== num);
  currentIndex.value[num] = -1;
};
// 选择类型后显示选中，每种类型只能选择一个选择全部时立即取消该类别选中
const handleSelect = (index: number, num: number, name: string) => {
  currentIndex.value[num] = index;
  if (index === -1) {
    //选择全部时立即取消该类别选中
    selectedList.value = selectedList.value.filter((item) => item.num !== num);
  } else {
    // 每种类型只能选择一个
    const exist = selectedList.value.find((item) => item.num === num);
    if (exist) {
      exist.name = name;
    } else {
      selectedList.value.push({ name, num });
    }
  }
};
//  获取数据
onMounted(async () => {
  const { data } = await typeListApi();
  typeList.value = data;
});

const editorContent = ref("");
const exportToHtml = () => {
  const blob = new Blob([editorContent.value], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "documnet.html";
  link.click();
  URL.revokeObjectURL(link.href);
};

const handleSubmit = () => {
  console.log(selectedList.value.map((item) => item.name));
};
</script>

<style scoped lang="scss">
.title {
  display: inline-block;
  width: 80px;
  font-size: 14px;
}
.el-tag {
  cursor: pointer;
}
</style>
