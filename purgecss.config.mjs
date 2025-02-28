// purgecss.config.mjs
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { PurgeCSS } from 'purgecss';

export default {
  content: ['./src/**/*.{astro,html,js,svelte,vue,ts,jsx,tsx}'],
  css: ['./dist/css/**/*.css'],
  output: ['./dist/css'],
  safelist: {
    greedy: [/astro-transition*/, /data-astro-*/],
  },
  extractors: [
    {
      extractor: (content) => {
        return content.match(/[A-Za-z0-9_-]+/g) || [];
      },
      extensions: ['astro', 'html', 'js', 'svelte', 'vue', 'ts', 'jsx', 'tsx'],
    },
  ],
};