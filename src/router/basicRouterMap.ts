import { type RouteRecordRaw } from 'vue-router'
import type { Router } from 'vue-router'

// 静态路由集合
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/layouts/defaultLayout.vue'),
        redirect: "/dashboard",
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                component: () => import("@/views/dashboard/DashBoard.vue")
            },
            {
                path: "/operations/orders",
                name: "orders",
                component: () => import("@/views/operations/Orders.vue"),
                meta: {
                    keepAlive: true
                }
            },
            // {
            //     path: "/chargingstation/monitor",
            //     name: "monitor",
            //     component: () => import("@/views/chargingstation/Monitor.vue")
            // },
            // {
            //     path: "/chargingstation/revenue",
            //     name: "revenue",
            //     component: () => import("@/views/chargingstation/Revenue.vue")
            // },
            // {
            //     path: "/chargingstation/fault",
            //     name: "fault",
            //     component: () => import("@/views/chargingstation/Fault.vue")
            // },
            // {
            //     path: "/map",
            //     name: "map",
            //     component: () => import("@/views/map/ElectronicMap.vue")
            // },

            // {
            //     path: "/operations/detail",
            //     name: "detail",
            //     component: () => import("@/views/operations/Detail.vue")
            // },
            // {
            //     path: "/operations/total",
            //     name: "total",
            //     component: () => import("@/views/operations/Total.vue")
            // },
            // {
            //     path: "/alarm",
            //     name: "alarm",
            //     component: () => import("@/views/alarm/Alarm.vue")
            // },
            // {
            //     path: "/equipment",
            //     name: "equipment",
            //     component: () => import("@/views/equipment/Equipment.vue"),
            // },
            // {
            //     path: "/document",
            //     name: "document",
            //     component: () => import("@/views/document/Document.vue"),
            //     meta: {
            //         needAuth: ["admin", "manager"]
            //     }
            // },
            // {
            //     path: "/system",
            //     name: "system",
            //     component: () => import("@/views/system/System.vue"),
            //     meta: {
            //         needAuth: ["admin"]
            //     }
            // },
            // {
            //     path: "/personal",
            //     name: "personal",
            //     component: () => import("@/views/personal/Personal.vue")
            // },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: () => import('@/views/notFound.vue')
    }
];
export default routes;

// -----------------------------
// 动态路由处理（放在 basicRouterMap 中，使用 @ 别名解析）
// -----------------------------

// 预扫描 @/views 目录下的 vue 文件，生成映射。使用项目别名 @ 更稳定且可读
const viewModules = import.meta.glob('@/views/**/*.vue')

function resolveViewImport(url: string) {
    if (!url) return undefined

    // 目标归一化：去掉前导 / ，去掉非字母数字，转小写
    const target = (url.startsWith('/') ? url.slice(1) : url).replace(/[^a-z0-9]/gi, '').toLowerCase()

    // 简洁匹配：遍历所有 viewModules 的 key，比较 key 的 views/... 部分（忽略大小写和非字母数字）
    for (const key of Object.keys(viewModules)) {
        // 提取 views/ 后的相对路径并归一化
        const idx = key.indexOf('/views/')
        let rel = idx !== -1 ? key.slice(idx + '/views/'.length) : key
        rel = rel.replace(/\.vue$/i, '') // 去掉后缀
        const norm = rel.replace(/[^a-z0-9]/gi, '').toLowerCase()
        if (norm === target || norm.endsWith(target)) {
            return viewModules[key]
        }
    }

    return undefined
}

function sanitizeRouteName(url: string) {
    if (!url || url === '/') return 'root'
    return url.replace(/^\//, '').replace(/\//g, '_')
}

/**
 * 根据 menu 添加动态路由（添加为 Home 的子路由）
 * 返回已添加的 route name 列表，便于后续移除
 */
export function addDynamicRoutesFromMenu(routerInstance: Router, menu: any[] = []): string[] {
    const added: string[] = []
    if (!Array.isArray(menu) || menu.length === 0) return added

    const walk = (items: any[]) => {
        for (const it of items) {
            const url = it.url

            // 如果当前菜单项存在 children，则视为父级菜单，不应直接匹配 view 组件
            const importFn = (it.children && it.children.length > 0) ? null : resolveViewImport(url)

            const name = sanitizeRouteName(url)


            if (importFn) {
                const route: RouteRecordRaw = {
                    path: url,
                    name,
                    component: importFn as any,
                    meta: it.meta || {}
                }
                if (!routerInstance.hasRoute(name)) {
                    try {
                        routerInstance.addRoute('Home', route)
                        added.push(name)
                    } catch (e) {
                        console.warn('add route failed', name, e)
                    }
                }
            }
            if (it.children && Array.isArray(it.children)) walk(it.children)
        }
    }

    walk(menu)
    return added
}

/**
 * 移除通过 addDynamicRoutesFromMenu 添加的路由
 */
export function removeDynamicRoutesFromMenu(routerInstance: Router, names: string[]) {
    if (!Array.isArray(names) || names.length === 0) return
    for (const name of names) {
        try {
            if (routerInstance.hasRoute(name)) routerInstance.removeRoute(name)
        } catch (e) {
            console.warn('remove route failed', name, e)
        }
    }
}