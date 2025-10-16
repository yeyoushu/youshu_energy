import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import { fileURLToPath, URL } from 'node:url';
import path from 'path';
export default defineConfig({
  // 当部署到 GitHub Pages 仓库页面（https://<user>.github.io/youshu_energy/）时
  // 需要设置 base 为仓库名路径，否则构建产物中的静态资源会以 `/` 根路径引用，导致页面在子路径下无法加载。
  base: '/youshu_energy/',
  plugins: [vue()],
  resolve: {
    alias: {
      // '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorMaxWorkers: true, // 使用多线程处理提升性能
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;` // 全局引入变量文件
      }
    }
  }
  ,
  // server: {
  //   // 开发时代理配置：将以 /station 开头的请求代理到目标后端或 mock 服务。
  //   // 这样在开发时可以直接使用 /station/xxx 的路径，避免跨域问题并让本地 mock 生效。
  //   proxy: {
  //     '/station': {
  //       target: process.env.VITE_UPLOAD_URL || 'https://www.demo.com',
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/station/, '/station')
  //     }
  //   }
  // },
  // 轻量构建优化（不改业务代码，仅优化打包输出）
  build: {
    // 生产环境关闭 source map 以减小包体积
    sourcemap: false,
    // 启用 terser 时可以更小但更慢，默认 esbuild 已足够
    // minify: 'esbuild',
    rollupOptions: {
      output: {
        // 将常见库拆分为 vendor chunk，提升缓存命中
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia', 'element-plus', 'echarts', 'axios']
        },
        // 带 hash 的文件名便于 CDN 缓存策略
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // 小项目使用默认压缩器（esbuild）通常最快且效果好
    // target: 'es2018'
  }
});