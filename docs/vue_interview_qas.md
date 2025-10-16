# Vue 面试详解 - 常见问答集合

说明：本文件按主题列出每个主题下的 2-4 个常见面试问答及详解，便于记忆与背诵。

## 1. Vue 基础与模板

Q1: v-if 与 v-show 区别是什么？
A1: v-if 在条件为 false 时会销毁对应 DOM 节点并移除监听器，下一次为 true 时会重新创建；v-show 仅切换元素的 CSS display 属性，元素始终存在于 DOM。v-if 适合不频繁切换以节省渲染开销，v-show 适合频繁切换以避免重复创建销毁成本。

Q2: v-for 使用时为什么要加 key？key 有哪些注意点？
A2: key 用于标识节点唯一性，帮助 diff 算法在重用或替换节点时保持稳定。避免使用索引作为 key（当列表可变时会导致元素错位复用）；应尽量使用稳定、唯一的标识（如 id）。

Q3: 组件通信有哪些方式，如何选用？
A3: 父子间（props/$emit）、兄弟可通过父组件传递或事件总线、跨层级可用 provide/inject、全局状态用 store（Pinia/Vuex）。选用依据数据流向、耦合度与可维护性：简单数据用 props/$emit，跨层级少量数据可用 provide/inject，大规模共享用 store。

示例：父子 props/$emit

```vue
<!-- Parent.vue -->
<template>
 <child :msg="message" @update="onUpdate" />
 <p>child says: {{ childMsg }}</p>
</template>
<script setup>
import { ref } from 'vue'
import Child from './Child.vue'
const message = ref('hello')
const childMsg = ref('')
function onUpdate(payload){ childMsg.value = payload }
</script>

<!-- Child.vue -->
<template>
 <div>
  <p>{{ msg }}</p>
  <button @click="$emit('update', 'ok from child')">send</button>
 </div>
</template>
<script setup>
defineProps({ msg: String })
</script>
```

说明：父组件通过 props 向子组件传递数据（单向），子组件通过 $emit 触发事件把数据或通知发送给父组件。父组件在模板中用事件监听（@update）接收并处理。

注意：props 是单向的，子组件若要修改传入数据应该在内部 copy 或通过 emit 请求父组件修改。

## 2. 响应式原理

Q1: Vue3 的响应式与 Vue2 有什么不同？
A1: Vue2 基于 Object.defineProperty 实现 getter/setter，存在数组索引与新增属性检测问题；Vue3 使用 Proxy，能直接监听新增属性与数组索引，性能和能力更好，且更易实现深响应与 handler 拦截。响应式核心是依赖收集(track)与触发(trigger)。

Q2: ref 与 reactive 的区别及使用场景？
A2: ref 用于基本类型或需要单独引用的场景，返回对象 { value }；reactive 返回的是对象代理，适合复杂对象。在模板内 ref 自动解包。若要从 reactive 中拿到响应式引用用于单独属性，可使用 toRef/toRefs。

示例：provide / inject（跨层级少量共享）

```vue
// Provider.vue
<template>
 <slot />
</template>
<script setup>
import { provide, ref } from 'vue'
const theme = ref('dark')
provide('theme', theme)
</script>

// Consumer.vue
<template>
 <div>theme: {{ theme }}</div>
 <button @click="toggle">toggle</button>
</template>
<script setup>
import { inject } from 'vue'
const theme = inject('theme')
function toggle(){ if(theme) theme.value = theme.value === 'dark' ? 'light' : 'dark' }
</script>
```

示例：Pinia 基本 store

```ts
// store/counter.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useCounter = defineStore('counter', () => {
 const count = ref(0)
 function inc(){ count.value++ }
 return { count, inc }
})

// 使用：
// const counter = useCounter(); counter.inc()
```

补充：toRef / toRefs 与 computed 示例

```js
import { reactive, toRef, toRefs, computed } from 'vue'
const state = reactive({ user: { name: 'Alice', age: 30 }, count: 0 })

// 单独获取深层属性的响应式引用
const nameRef = toRef(state, 'user') // 注意：toRef 针对顶级属性，深层属性需要 toRef(user,'name')

// 展平对象为多个 ref
const { count } = toRefs(state)

const double = computed(() => count.value * 2)
```

## 3. Composition API

Q1: setup() 的执行时机和作用域是什么？
A1: setup 在组件实例创建之前执行（props 已解析但尚未挂载），用于声明响应式状态与副作用，并返回供模板使用的值。setup 中不能直接访问 this，若需要事件或 emit，可通过第二个参数 context 获取 emit 等。

Q2: computed 与 watch 的差别？
A2: computed 是基于依赖缓存的计算属性，适合用于模板或其他计算依赖，并且只有在依赖变化时重新计算。watch 用于观测响应式数据并执行副作用（异步或复杂逻辑），常用于请求/异步操作或监听某个值变化触发处理。

示例：setup 返回值、emit、watch、watchEffect

```vue
<script setup>
import { ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
const count = ref(0)
const router = useRouter()

function inc(){ count.value++ }

// watch 用于副作用
watch(count, (newVal, oldVal) => {
    console.log('count changed', oldVal, '->', newVal)
})

// watchEffect 自动跟踪依赖
watchEffect((onCleanup) => {
    console.log('effect runs, count =', count.value)
    onCleanup(() => { /* 清理逻辑 */ })
})

// setup 返回的值会暴露给模板
return { count, inc }
</script>
```

## 4. 生命周期与副作用

Q1: 在哪个生命周期注册事件监听最合适？如何清理？
A1: 在 onMounted 中注册全局或 DOM 相关事件（如 window resize），在 onBeforeUnmount 中移除以避免内存泄漏。若在 setup 中使用 watchEffect，可返回一个清理函数。

Q2: watchEffect 的清理机制如何使用？
A2: watchEffect 的回调可以接受一个 onCleanup(fn) 参数，用来在依赖变更或副作用被停止时执行清理逻辑，常用于异步订阅清理。

## 5. 模板编译 / 虚拟 DOM

Q1: 静态节点提升的作用是什么？
A1: 静态提升会把模板中的静态 VNode 提取到编译时常量，运行时不再重复创建，减少渲染开销。编译器能识别并优化静态子树。

Q2: 为什么 key 对 diff 很重要？
A2: key 标识节点身份，帮助 diff 算法判断节点是被复用还是销毁重建，减少 DOM 操作并避免状态错位。

## 6. 组件设计与性能优化

Q1: 如何优化一个含大量行的表格？
A1: 使用虚拟滚动（只渲染可视区域）、分页或后端分页、减少子组件实例、合并渲染逻辑、避免不必要的 computed/re-render。

Q2: 组件拆分的策略是什么？
A2: 按单一职责拆分，避免父组件过大。把频繁更新的部分拆到子组件，减少父组件的重渲染面积。关注数据流向并尽可能降低 props 传递。

## 7. 指令与自定义指令

Q1: 自定义指令合适的使用场景？
A1: 需要直接操作 DOM 的场景，如自动聚焦、权限控制（DOM 层隐藏/移除）、滚动条行为等。复杂逻辑建议放在 composition 函数或组件里，指令适合跨组件的 DOM 操作复用。

Q2: v-model 在组件内部如何实现？
A2: 组件定义 prop（一般为 modelValue），并在输入时 emit('update:modelValue', newValue)。v-model 在语法层是语法糖。

示例：自定义指令（v-focus）

```ts
// directives/focus.ts
import { Directive } from 'vue'
const focus: Directive = {
    mounted(el) {
        el.focus()
    }
}
export default focus

// 注册（main.ts）
// app.directive('focus', focus)
```

使用说明：自定义指令适用于需要直接操作 DOM 的场景，如自动聚焦、滚动到元素或权限层级隐藏。指令生命周期钩子有 mounted、updated、unmounted。

## 8. 路由与状态管理

Q1: 如何实现权限路由？
A1: 在路由守卫中（router.beforeEach）检查用户权限/角色，决定是否放行或重定向到登录/无权限页。配合 store 保存用户信息与路由白名单。

Q2: Pinia 的优点？
A2: API 简洁、TypeScript 友好、基于组合式 API，易于组织模块化 store，支持热重载和插件体系。

示例：权限路由（router.beforeEach）

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = createRouter({ history: createWebHistory(), routes: [ /* ... */ ] })

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    const requiresAuth = to.meta?.requiresAuth
    if (requiresAuth && !auth.isLoggedIn) {
        return next({ name: 'login' })
    }
    // 权限校验示例
    const roles = to.meta?.roles || []
    if (roles.length && !roles.includes(auth.role)) {
        return next({ name: '403' })
    }
    next()
})

export default router
```

说明：路由守卫适合集中校验用户是否登录、角色/权限是否匹配，并作重定向或阻止访问。把权限信息放到 store 中（如 Pinia）便于在守卫中读取。

## 9. 构建与工程化

Q1: Vite 的 dev 与 build 有何不同？
A1: Vite 开发模式使用原生 ESM 加速冷启动，构建使用 Rollup 打包并做优化（代码分割、Tree-shaking）。Vite dev 更快，build 更依赖 Rollup 的配置。

Q2: 如何进行代码分割？
A2: 使用路由懒加载（dynamic import）或在 build.rollupOptions.manualChunks 中配置第三方库拆分为 vendor。

示例：Pinia 更完整的 store 与组件使用

```ts
// stores/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const user = ref({ id: null, name: '', role: '' })
    function setUser(u) { user.value = u }
    function logout() { user.value = { id: null, name: '', role: '' } }
    return { user, setUser, logout }
})

// 组件中使用
/*
<script setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
// 在模板中使用 userStore.user.name
</script>
*/
```

说明：Pinia 推荐把 state/actions 定义成组合式函数（setup store），更容易与 Composition API 协作并且 TypeScript 支持更好。

## 10. 测试与质量

Q1: 组件如何做单元测试？
A1: 用 Vue Test Utils mount 组件并断言 DOM / 交互。mock 外部请求用 vi.mock 或 jest mock。关键是把逻辑与视图分离，便于断言。

Q2: E2E 什么时候必需？
A2: 当要覆盖真实用户流程（登录、表单、跳转、关键业务流程）时，E2E 确保系统整体可用性。

示例：Vue Test Utils 基本单元测试

```ts
// Hello.spec.ts
import { mount } from '@vue/test-utils'
import Hello from '@/components/Hello.vue'

test('renders message', () => {
    const wrapper = mount(Hello, { props: { msg: 'hello' } })
    expect(wrapper.text()).toContain('hello')
})
```

说明：单元测试关注组件逻辑与渲染，使用 `mount` 或 `shallowMount`，mock 外部依赖（如网络请求）以提高测试稳定性。

## 11. 进阶原理

Q1: nextTick 的使用场景是什么？
A1: 在需要在 DOM 更新完成后读取或操作 DOM（如获取元素高度）时使用 nextTick。因为 Vue 的 DOM 更新是异步批量的。

Q2: Vue 的异步更新队列如何避免多次同步更新导致重复渲染？
A2: Vue 在同一 tick 内合并多次状态更新到一个异步队列，最终统一触发一次渲染，提高效率。

----

文件生成时间：2025-10-10
