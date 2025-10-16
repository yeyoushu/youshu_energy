import { createRouter, createWebHashHistory } from 'vue-router'
// import type { Router } from 'vue-router'
import routes from './basicRouterMap'

const router = createRouter({
    // 原来使用 history 模式（保留注释以便回退）：
    // history: createWebHistory(import.meta.env.BASE_URL),
    // 切换为 hash 模式以方便在 GitHub Pages 等静态托管中部署（无需服务器重写规则）
    history: createWebHashHistory(),
    routes
});

// 动态路由相关的助手函数已统一放在 `src/router/basicRouterMap.ts` 中，
// 这里保持 router 的创建与导出简洁。

export default router;