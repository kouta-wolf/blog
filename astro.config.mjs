// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import { unified } from '@astrojs/markdown-remark';
import remarkBreaks from 'remark-breaks';
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import remarkCallouts from './src/lib/remark-callouts.mjs';

// Google Fonts は日本語を [0]〜[119] の番号付きサブセットに分割して配信している。
// ページで使う文字を含むファイルだけがブラウザに読み込まれる
const japaneseSubsets = Array.from({ length: 120 }, (_, i) => `[${i}]`);

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.hexwolf.org',

  integrations: [
    // markdown より前に置く必要がある(コードブロックを先に処理させるため)
    expressiveCode({
      themes: ['github-dark'],
      plugins: [pluginLineNumbers()],
      // 行番号は ```js showLineNumbers のように指定したブロックだけに付ける
      defaultProps: { showLineNumbers: false },
      // 色は global.css の --code-* 変数で管理する
      styleOverrides: {
        borderRadius: '12px',
        borderColor: 'var(--code-border)',
        codeBackground: 'var(--code-bg)',
        codeForeground: 'var(--code-text)',
        codeFontFamily: 'var(--font-mono)',
        codeFontSize: '14px',
        codeLineHeight: '1.7',
        uiFontFamily: 'var(--font-mono)',
        uiFontSize: '13px',
        frames: {
          frameBoxShadowCssValue: 'none',
          editorTabBarBackground: 'var(--code-header-bg)',
          editorTabBarBorderBottomColor: 'var(--code-border)',
          editorActiveTabBackground: 'var(--code-bg)',
          editorActiveTabForeground: 'var(--code-text)',
          editorActiveTabIndicatorTopColor: 'transparent',
          editorActiveTabIndicatorBottomColor: 'var(--code-accent)',
          editorBackground: 'var(--code-bg)',
          terminalBackground: 'var(--code-bg)',
          terminalTitlebarBackground: 'var(--code-header-bg)',
          terminalTitlebarForeground: 'var(--code-sub)',
          terminalTitlebarDotsForeground: 'var(--code-dot)',
          terminalTitlebarDotsOpacity: '1',
          terminalTitlebarBorderBottomColor: 'var(--code-border)',
          inlineButtonForeground: 'var(--code-sub)',
          inlineButtonBorder: 'var(--code-border)'
        },
        textMarkers: {
          markBackground: 'var(--code-mark)',
          markBorderColor: 'var(--code-accent)'
        },
        lineNumbers: {
          foreground: 'var(--code-line-number)',
          highlightForeground: 'var(--code-accent)'
        }
      }
    })
  ],

  markdown: {
    processor: unified({ remarkPlugins: [remarkCallouts, remarkBreaks] })
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
