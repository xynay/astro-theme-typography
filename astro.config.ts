import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import { THEME_CONFIG } from "./src/theme.config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: THEME_CONFIG.website,
  prefetch: false,
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
      layer: 'app',
    }),
    robotsTxt({
      policy: [{ userAgent: '*', allow: '/' }],
    }),
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
            if (
              /[\\/]node_modules[\\/](?!(astro|@astrojs))/.test(id)
            ) {
              return 'vendor';
            }
            if (id.includes('astro/dist')) {
              return 'astro';
            }
            if (id.includes('src/')) {
              return 'app';
            }
          },
          experimentalMinChunkSize: 20000,
          chunkFileNames: 'js/[name].[hash].js',
          entryFileNames: 'js/[name].[hash].js',
          assetFileNames: ({ name }) => {
            if (/\.css$/i.test(name ?? '')) {
              return 'css/global.[hash][extname]';
            }
            return 'assets/[name].[hash][extname]';
          },
        },
      },
      terserOptions: {
        compress: { passes: 3 },
      },
      chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      force: true,
    },
  },
  dev: { 
    client: { 
      logging: 'none' 
    }
  },
  prerender: {
    crawl: true,
    routes: ['/**'],
  },
});