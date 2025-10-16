import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import router from '@/router'
// Element Plus 配置
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// Element Plus 中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 注册路由守卫（必须在 pinia 注册之后）
import { registerNavigationGuard } from "@/router/guard";
import { createPinia } from 'pinia'
import './mock'  // 引入mock
import { useUserStore } from '@/store/auth'
import '@arcgis/core/assets/esri/themes/light/main.css';
// 自定义指令
import permission from '@/directives/permission'
const app = createApp(App)
const pinia = createPinia()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(pinia)
app.use(ElementPlus, { locale: zhCn })
const userStore = useUserStore()
userStore.restoreRoutesFromSession()
app.use(router)

// 注册全局自定义指令 v-permission
app.directive('permission', permission)

registerNavigationGuard(router as any)
app.mount('#app')