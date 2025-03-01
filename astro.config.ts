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
      langs: ['javascript', 'typescript', 'html', 'markdown'], // 仅加载必要的语言支持
      wrap: true,
      highlight: {
        strategy: 'inline', // 优化高亮性能
      },
    },
  },
  integrations: [
    UnoCSS({
      injectReset: true,
      layer: {
        base: 'base',
        components: 'components',
        utils: 'utils',
      },
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
        limit: 50000, // 优化 sitemap 文件大小
      },
    }),
    mdx(),
  ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'react-vendor';
              return 'app'; // 所有的 vendor 打包到一起
            }
            // CSS 代码分割 - 尝试按页面或组件分割
            if (id.includes('src/pages')) {
              const pageName = id.split('src/pages/')[1].split('/')[0];
              return `page-${pageName}`;
            }
            if (id.includes('src/components')) {
              const componentName = id.split('src/components/')[1].split('/')[0];
              return `component-${componentName}`;
            }
            return 'app'; // 所有的代码全部打包到app
          },
          entryFileNames: 'js/[name].[hash].js',
          chunkFileNames: 'js/[name].[hash].js',
          assetFileNames: ({ name }) => {
            if (/\.css$/.test(name ?? '')) {
              return 'css/[name].[hash][extname]';
            }
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name ?? '')) {
              return 'images/[name].[hash][extname]';
            }
            return 'assets/[name].[hash][extname]';
          },
          assetInlineLimit: 2048,  //关键
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
      logging: 'error', // 减少开发日志输出
    },
  },
  prerender: {
    crawl: true,
    routes: [
      '/**',
    ],
  },
});