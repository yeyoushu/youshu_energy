/// <reference types="vite/client" />
declare module 'mockjs';
declare module 'file-saver'
declare module '*.vue' {
    import { ComponentOptions } from 'vue';
    const component: ComponentOptions;
    export default component
}
// file-saver声明


