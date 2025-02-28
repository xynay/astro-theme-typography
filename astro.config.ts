import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import { THEME_CONFIG } from "./src/theme.config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: THEME_CONFIG.website,
  prefetch: false, // 禁用预取避免额外分块
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      langs: ['javascript', 'typescript', 'html', 'markdown'],
      wrap: true,
    },
  },
  integrations: [
    UnoCSS({
      injectReset: true,
      layer: 'app', // 强制单一样式层
      // 删除所有variant配置
    }),
    robotsTxt({
      policy: [{ userAgent: '*', allow: '/' }],
    }),
    sitemap({ options: { limit: 50000 } }),
    mdx(),
  ],
  vite: {
    build: {
      target: 'esnext', // 确保现代打包模式
      cssCodeSplit: false, // 禁用CSS分割
      rollupOptions: {
        preserveEntrySignatures: 'strict', // 禁用自动分块
        output: {
          // 强化分包策略
          manualChunks: (id) => {
            // 精确匹配 node_modules
            if (/[\\/]node_modules[\\/]/.test(id)) return 'vendor';
            // 合并 Astro 核心逻辑
            if (id.includes('astro/dist')) return 'app';
            // 强制合并所有业务代码
            if (id.includes('src/')) return 'app';
          },
          // 强制合并策略
          experimentalMinChunkSize: 20000, // 20KB 以下强制合并
          chunkFileNames: 'js/[name].[hash].js',
          entryFileNames: 'js/[name].[hash].js',
          assetFileNames: ({ name }) => {
            // 强制单一 CSS 文件
            if (/\.css$/i.test(name ?? '')) return 'css/global.[hash][extname]';
            // 其他资源保持默认
            return 'assets/[name].[hash][extname]';
          },
        },
      },
      terserOptions: {
        compress: { passes: 3 }, // 加强压缩
      },
      chunkSizeWarningLimit: 1000, // 消除警告
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      force: true, // 强制预构建
    },
  },
  dev: { 
    client: { 
      logging: 'none' // 彻底禁用开发日志
    }
  },
  prerender: {
    crawl: true,
    routes: ['/**'],
  },
});