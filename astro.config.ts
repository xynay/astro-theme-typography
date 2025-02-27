import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import { THEME_CONFIG } from "./src/theme.config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: THEME_CONFIG.website,
  prefetch: true,
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      langs: [],
      wrap: true,
    },
  },
  integrations: [
    UnoCSS({
      injectReset: true
    }),
    robotsTxt(),
    sitemap(),
    mdx()
  ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 精细化代码分块
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'react-vendor';
              if (id.includes('@astro')) return 'astro-vendor';
              return 'vendor';
            }
            if (id.includes('src/layouts')) return 'layouts'; // 布局代码单独分块
            if (id.includes('src/components')) return 'components'; // 组件库单独分块
          },
          entryFileNames: 'js/[name].[hash].js',
          chunkFileNames: 'js/[name].[hash].js',
          assetFileNames: ({ name }) => {
            // 仅保留必要资源分类
            return /\.css$/.test(name ?? '') 
              ? 'css/[name].[hash][extname]'
              : 'assets/[name].[hash][extname]';
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          pure_funcs: ['console.info'] // 保留特定日志
        },
        format: {
          comments: false // 删除所有注释
        }
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['@types/**'], 
    },
    plugins: [
      // CSS Tree Shaking
      require('vite-plugin-purgecss')({
        content: ['./src/**/*.{astro,mdx,jsx,tsx}'],
        safelist: [/data-*/], // 保留数据属性样式
      }),
    ],
  },
  // 服务端渲染缓存策略
});