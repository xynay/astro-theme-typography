import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import { THEME_CONFIG } from "./src/theme.config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// 修复核心：隔离 Astro 运行时
export default defineConfig({
  site: THEME_CONFIG.website,
  prefetch: false,
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      langs: ['javascript', 'typescript', 'html', 'markdown'],
    },
  },
  integrations: [
    UnoCSS({
      injectReset: true,
      layer: 'app'
    }),
    robotsTxt({ policy: [{ userAgent: '*', allow: '/' }] }),
    sitemap({ options: { limit: 50000 } }),
    mdx(),
  ],
  vite: {
    build: {
      target: 'esnext',
      cssCodeSplit: false,
      rollupOptions: {
        preserveEntrySignatures: 'strict',
        output: {
          manualChunks: (id) => {
            // 排除 astro 核心模块
            if (/[\\/]node_modules[\\/](?!(astro|@astrojs))/.test(id)) {
              return 'vendor';
            }
            // 强制分离 astro 运行时
            if (id.includes('astro/dist/client')) {
              return 'astro-runtime';
            }
            if (id.includes('src/')) {
              return 'app';
            }
          },
          chunkFileNames: 'js/[name].[hash].js',
          entryFileNames: 'js/[name].[hash].js',
          assetFileNames: ({ name }) => {
            return /\.css$/i.test(name ?? '') 
              ? 'css/global.[hash][extname]' 
              : 'assets/[name].[hash][extname]';
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['astro'], // 关键修复：排除 astro 依赖
      force: true
    }
  },
  dev: { client: { logging: 'error' } },
  prerender: { crawl: true, routes: ['/**'] }
});