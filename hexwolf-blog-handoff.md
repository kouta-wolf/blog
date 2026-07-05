# HexWolf 個人ブログ構築 - 引き継ぎメモ

## プロジェクト概要
- **名前**: HexWolf(サイト名/ハンドルネームブランド)
  - 由来: TRPG好き(ソードワールド2.5)+ Wolf(HN "ookami_kouta"由来)+「6」(2d6ダイス、hex=6)を掛け合わせた造語
- **用途**: HexWolfブランドの2つ目のサイト。1つ目の[ポートフォリオサイト](../portfolio)は構築済み・Cloudflareへのデプロイまで完了している(本番URL: `https://portfolio.koutaookami18.workers.dev`、GitHub: `kouta-wolf/portfolio`)
- **このプロジェクト(`hexwolf/blog`)では個人ブログを新規に立ち上げる**
  - WordPress運用経験はあるが、管理画面の重さ・コストがネックで離脱。今回はSSGで解決したい

## 技術スタック(決定事項、ポートフォリオと共通)
- **SSG**: Astro(`output: 'static'`)
- **UIライブラリ**: React(アイランドとして部分使用、`@astrojs/react`)
- **スタイル**: Tailwind CSS v4(`@tailwindcss/vite`方式)
- **ホスティング**: Cloudflare(Workers/Pages統合基盤。ポートフォリオと同様、GitHubリポジトリ連携でmainブランチpush時に自動デプロイする想定)
- **リポジトリ**: ポートフォリオとは別リポジトリにする方針(モノレポにしない。Cloudflareのビルド設定がシンプルに保てるため)

## 現在の状態(このディレクトリの中身)
- `npm create astro@latest`(minimalテンプレート、TypeScript strict)+ `astro add react` + `astro add tailwind` まで実行済み
- ビルド確認済み(`astro build`が通ることを確認)
- **まだgit init / GitHubリポジトリ作成はしていない**
- ポートフォリオ側で使った構成(`src/layouts/Layout.astro`でグローバルCSSをimport、`src/content.config.ts`でContent Collections定義など)はまだこちらには反映していない。ポートフォリオのやり方を踏襲する想定

## ブログの content 方針(相談したいこと・未確定)
- **ネタ元**: Obsidianに書き溜めてきた日々の学びを体系化する
- **トーンについての希望**: Zennのようにある程度文章が整った技術記事を書くプラットフォームは既にあるので、そこと差別化したい。「日記」「簡易的な技術紹介」くらいの緩さを出したい、車輪の再発明(Zennと同じような記事)は避けたい
- **未確定・次のClaudeと相談すべきこと**:
  - カテゴリ分け/タグ設計(日記と技術記事を明確に分けるか、それとも緩く混在させるか)
  - Content Collectionsのスキーマ設計(ポートフォリオの`projects`同様、Markdown1ファイル=1記事にする想定だが、frontmatterに何を持たせるか: 日付、カテゴリ、タグ、公開/下書き状態など)
  - Obsidianのメモをどう移行するか(Obsidian特有の記法 `[[wikilink]]` や画像埋め込みなどの扱い)
  - デザイン(ポートフォリオはグレースケール規約で組んでから配色を決めた。ブログも同様のプロセスにするか、ポートフォリオの配色をそのまま流用するか)

## 参考: 本人のバックグラウンド
- 元看護師(訪問看護含む)、現在は通信制プログラミングスクール在籍中。WEBエンジニアへの転職を目指している
- Rails + Hotwireでの卒業制作(vitals-roll)を進行中
- WSL(Ubuntu)+ Zed/VSCode + Claude Code CLIで開発環境構築済み
- ポートフォリオサイト構築時のClaudeとのやり取りから: 説明は既知の技術(Rails/Hotwireなど)との対比があると理解が早い。コミットメッセージはConventional Commits(`feat:`/`chore:`等)を使うこと
