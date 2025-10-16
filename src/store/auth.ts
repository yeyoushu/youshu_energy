import { defineStore } from "pinia";
import { loginApi } from "@/api/user";
import router from '@/router'
import { addDynamicRoutesFromMenu, removeDynamicRoutesFromMenu } from '@/router/basicRouterMap'


interface LoginData {
    username: string;
    password: string;
}
export const useUserStore = defineStore("user", {
    state: () => ({
        token: sessionStorage.getItem('token') || '',
        roles: sessionStorage.getItem('roles') ? JSON.parse(sessionStorage.getItem('roles')!) : [],
        userName: sessionStorage.getItem('username') || '',
        menu: sessionStorage.getItem('menu') ? JSON.parse(sessionStorage.getItem('menu')!) : [],
        // 保存登录时动态添加的路由 name 列表，便于 logout 时清理
        addedRoutes: sessionStorage.getItem('addedRoutes') ? JSON.parse(sessionStorage.getItem('addedRoutes')!) : [] as string[]
    }),
    actions: {
        async login(data: LoginData) {
            try {
                const { data: { token, user: { username, roles }, menulist } } = await loginApi(data);
                this.token = token;
                this.userName = username;
                this.roles = roles;
                this.menu = menulist;
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('roles', JSON.stringify(roles));
                sessionStorage.setItem('menu', JSON.stringify(menulist));

                // 登录成功后动态注册路由，并把添加的 route name 保存到 store
                try {
                    const added = addDynamicRoutesFromMenu(router as any, menulist)
                    console.log('added routes', added);

                    if (Array.isArray(added) && added.length > 0) {
                        this.addedRoutes = added
                        // 跳转到第一个成功添加的路由（使用路由名）
                        await router.push({ name: added[0] })
                    }
                    // 将已添加的 route name 同步到 sessionStorage，便于刷新恢复
                    sessionStorage.setItem('addedRoutes', JSON.stringify(this.addedRoutes))
                } catch (e) {
                    console.warn('动态路由添加失败', e)
                }

            } catch (error) {
                console.log('登录失败', error);
            }

        }
        ,
        // 登出：先导航到登录页，移除动态路由，清空状态
        async logout() {
            try {
                await router.push('/login')
            } catch { }
            try {
                removeDynamicRoutesFromMenu(router as any, this.addedRoutes || [])
            } catch (e) {
                console.warn('移除动态路由失败', e)
            }
            this.token = ''
            this.userName = ''
            this.roles = []
            this.menu = []
            this.addedRoutes = []
            sessionStorage.clear()
        }
        ,
        // 从 sessionStorage 恢复动态路由（在刷新后可调用）
        restoreRoutesFromSession() {
            try {
                const menu = sessionStorage.getItem('menu') ? JSON.parse(sessionStorage.getItem('menu')!) : null
                const added = sessionStorage.getItem('addedRoutes') ? JSON.parse(sessionStorage.getItem('addedRoutes')!) : null
                if (Array.isArray(menu) && Array.isArray(added)) {
                    try {
                        const addedNames = addDynamicRoutesFromMenu(router as any, menu)
                        // 合并已恢复的路由名
                        this.addedRoutes = Array.from(new Set([...(this.addedRoutes || []), ...addedNames]))
                    } catch (e) {
                        console.warn('恢复动态路由失败', e)
                    }
                }
            } catch (e) {
                // ignore
            }
        }
    }
});
