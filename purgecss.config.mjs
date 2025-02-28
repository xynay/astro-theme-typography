import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { PurgeCSS } from 'purgecss';
import path from 'path';

export default {
  content: ['./src/**/*.{astro,html,js,svelte,vue,ts,jsx,tsx}'],
  css: ['./dist/css/_@astro-renderers.wVoPu1zJ.css'],  //  修改这里
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
    transform: (code, filepath) => {
      console.log(`PurgeCSS: Transforming ${filepath}`);
      return { code, filepath };
    },
};