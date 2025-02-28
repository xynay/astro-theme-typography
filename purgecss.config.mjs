import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { PurgeCSS } from 'purgecss';
import glob from 'glob';
import path from 'path';

const getAllCssFiles = () => {
  const files = glob.sync('./dist/css/_@astro-renderers.*.css');
  console.log('PurgeCSS扫描到的CSS文件:', files); // 添加这行来调试
  return files;
};

export default {
  content: ['./src/**/*.{astro,html,js,svelte,vue,ts,jsx,tsx}'],
  css: getAllCssFiles(),
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
        const baseName = path.basename(filepath);  // 获取文件名，例如 _@astro-renderers.xxxx.css
        const newFilepath = path.join('./dist/client/css', baseName); // 转换路径
        console.log(`PurgeCSS: Transforming output path from ${filepath} to ${newFilepath}`);
        return { code, filepath: newFilepath };
      },
};