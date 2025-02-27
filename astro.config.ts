import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import { THEME_CONFIG } from "./src/theme.config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: THEME_CONFIG.website,
  prefetch: {
    mode: 'visible', // 只对可见链接预加载
  },
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      langs: ['javascript', 'typescript', 'html', 'markdown'],
      wrap: true,
      highlight: {
        strategy: 'server', // 让 Astro 在服务器端完成代码高亮
      },
    },
  },
  integrations: [
    UnoCSS({
      injectReset: false, // 关闭运行时 CSS 重置，改为手动引入
    }),
    robotsTxt({
      policy: [{ userAgent: '*', allow: '/' }],
    }),
    sitemap(),
    mdx(),
  ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) return 'vendor';
            if (id.includes('.mdx')) return 'mdx';
            return 'app';
          },
        },
      },
      minify: process.env.NODE_ENV === 'production' ? 'terser' : false, // 仅在生产环境压缩
      terserOptions: {
        compress: {
          drop_debugger: true, // 保留 console.log，避免额外计算开销
        },
      },
      treeshake: true,
    },
  },
});
