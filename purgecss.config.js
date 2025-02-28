// purgecss.config.js
const glob = require('glob');
const path = require('path');

module.exports = {
  // 扫描的文件
  content: ['./src/**/*.{astro,html,js,svelte,vue,ts,jsx,tsx}'],
  // CSS 文件输出路径
  css: ['./dist/css/**/*.css'],  //  修改这里
  // 处理后的 CSS 输出目录
  output: ['./dist/css'],  // 修改这里
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
  // 转换输出路径，以适应Vercel
  transform: (code, filepath) => {
    const newFilepath = filepath.replace('dist/css', 'dist/client/css');
    console.log(`PurgeCSS: Transforming output path from ${filepath} to ${newFilepath}`);
    return {
      code,
      filepath: newFilepath,
    };
  },
};