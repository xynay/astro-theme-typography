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
      langs: ['javascript', 'typescript', 'html', 'markdown'],
      wrap: true,
      highlight: {
        strategy: 'inline',
      },
    },
  },
  integrations: [
    UnoCSS({
      injectReset: true,
      // 关键修改：合并所有样式层
      layer: 'global', // 删除原 base/components/utils 分层
      variant: {
        responsive: ['md', 'lg'],
        state: ['hover', 'focus'],
      },
    }),
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
    }),
    sitemap({
      options: {
        limit: 50000,
      },
    }),
    mdx(),
  ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 合并所有依赖到 vendor
            if (id.includes('node_modules')) return 'vendor';
            // 合并 Astro 岛屿组件到主包
            if (id.includes('astro/src/client')) return 'app';
            // 合并业务代码到主包
            if (id.includes('src/')) return 'app';
          },
          // 强制合并小文件策略
          experimentalMinChunkSize: 10240, // 10KB 以下强制合并
          entryFileNames: 'js/[name].[hash].js',
          chunkFileNames: 'js/[name].[hash].js',
          assetFileNames: ({ name }) => {
            // 合并所有 CSS
            if (/\.css$/.test(name ?? '')) return 'css/global.[hash][extname]';
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name ?? '')) {
              return 'images/[name].[hash][extname]';
            }
            return 'assets/[name].[hash][extname]';
          },
          assetInlineLimit: 2048,
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        mangle: {
          properties: {
            regex: /^__/,
          },
        },
      },
      treeshake: true,
      strip: true,
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },
  dev: {
    hot: true,
    client: {
      logging: 'error',
    },
  },
  prerender: {
    crawl: true,
    routes: [
      '/**',
    ],
  },
});