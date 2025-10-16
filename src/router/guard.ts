// import router from "./index";
import type { Router } from "vue-router"
import { useUserStore } from "@/store/auth";

export const registerNavigationGuard = (router: Router) => {
    router.beforeEach((to) => {
        const userStore = useUserStore();
        const isLogin = userStore.token;
        // console.log('导航守卫', to, isLogin);
        if (!isLogin) {
            // 未登录
            if (to.path !== '/login') {
                return { path: '/login' };
            }
        } else {
            // 已登录
            if (to.path === '/login') {
                return { path: '/' };
            }
        }
    })
}
