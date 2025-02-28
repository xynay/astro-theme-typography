// purgecss.config.mjs
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { PurgeCSS } from 'purgecss';
import path from 'path';

export default {
  content: ['./src/**/*.{astro,html,js,svelte,vue,ts,jsx,tsx}'],
  css: ['./dist/css/_@astro-renderers.wVoPu1zJ.css'],
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
    const dirname = path.dirname(filepath); // 获取目录名
    const basename = path.basename(filepath); // 获取文件名
    const newPath = path.join(dirname, basename); // 拼接新的文件路径
    console.log(`PurgeCSS: Transforming output path from ${filepath} to ${newPath}`);
    return { code, filepath: newPath };
  },
};