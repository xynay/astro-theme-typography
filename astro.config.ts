import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import { THEME_CONFIG } from "./src/theme.config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// 重要提示：需先创建 uno.config.ts 文件（配置见下方）
export default defineConfig({
  site: THEME_CONFIG.website,
  prefetch: true,
  
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      langs: ['javascript', 'typescript', 'html', 'markdown'],
      wrap: true,
      highlight: { strategy: 'inline' }
    }
  },

  integrations: [
    // ================== 核心改动点：UnoCSS 深度优化 ==================
    UnoCSS({
      injectReset: '@unocss/reset/tailwind.css', // 自动注入重置样式
      mode: 'dist-chunk', // 生产模式优化
      layers: {
        base: 'base-layer',    // 基础样式层
        components: 'components-layer', // 组件样式层
        utilities: 'utilities-layer'     // 工具类层
      },
      safelist: [
        // 保留所有动态类名
        ...Array.from({ length: 10 }, (_, i) => `space-y-${i + 1}`), // 动态间距
        /^astro-/, 
        /^data-astro/,
        /^is-/, 
        /^has-/, 
        'active', 
        'open',
        // 保留颜色相关的动态类（如 bg-[#123456]）
        ...['red', 'blue', 'green'].map(c => `bg-${c}-500`),
        /^bg-\[#?[a-f0-9]+\]$/i, // 匹配所有十六进制颜色
        /^text-\[.+?\]$/
      ]
    }),
    // ================== 其他集成保持不变 ==================
    robotsTxt({
      policy: [{ userAgent: '*', allow: '/' }]
    }),
    sitemap({ options: { limit: 50000 } }),
    mdx()
  ],

  vite: {
    build: {
      cssCodeSplit: true, // 启用 CSS 代码分割
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return id.split('node_modules/')[1].split('/')[0];
            }
            return 'app';
          },
          // 统一资源输出规则
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      },
      minify: 'terser',
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
        mangle: { properties: { regex: /^__/ } }
      }
    },
    // ================== 关键性能优化 ==================
    optimizeDeps: {
      include: ['react', 'react-dom', '@unocss/reset']
    },
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        drafts: { nesting: false }, // 禁用嵌套语法避免冲突
        cssModules: { pattern: '[hash]_[local]' }
      }
    }
  },

  dev: {
    hot: true,
    client: { logging: 'error' }
  },

  prerender: {
    crawl: true,
    routes: ['/**']
  }
});