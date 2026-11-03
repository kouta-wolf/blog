// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import { unified } from '@astrojs/markdown-remark';
import remarkBreaks from 'remark-breaks';

// Google Fonts は日本語を [0]〜[119] の番号付きサブセットに分割して配信している。
// ページで使う文字を含むファイルだけがブラウザに読み込まれる
const japaneseSubsets = Array.from({ length: 120 }, (_, i) => `[${i}]`);

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.hexwolf.org',

  markdown: {
    processor: unified({ remarkPlugins: [remarkBreaks] })
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Noto Sans JP',
      cssVariable: '--font-noto-sans-jp',
      // Noto Sans JP は可変フォントなので、範囲指定にすると @font-face がサブセットごとに1つで済む
      weights: ['400 700'],
      subsets: ['latin', ...japaneseSubsets],
      fallbacks: ['Hiragino Sans', 'Yu Gothic UI', 'Meiryo', 'sans-serif'],
      // 自動調整は Arial を基準にするため日本語が含まれず、英数字だけ大きく崩れる。日本語のシステムフォントにそのまま任せる
      optimizedFallbacks: false,
      display: 'swap'
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [400, 500],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
      display: 'swap'
    }
  ]
});
