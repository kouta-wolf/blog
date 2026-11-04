# 記事の書き方

## 1. 記事ファイルを作る

ブログのディレクトリで次を実行する。

```sh
npm run new            # 対話で入力
npm run new -- sql-8   # ファイル名を先に指定
```

ファイル名・タイトル・カテゴリ(番号)・タグを入力すると `src/content/posts/<ファイル名>.md` ができ、nvim で本文の書き出し位置が開く。

- ファイル名がそのまま URL になる(`sql-8.md` → `/posts/sql-8/`)。半角英小文字・数字・`-`・`_` のみ
- 公開後にファイル名を変えると URL が変わるので注意

## 2. frontmatter

```yaml
---
title: "SQL学習シリーズ⑧：CTE"
date: 2026-11-04
category: "学習ノート"
tags: ["SQL", "学習ノート"]
description: "一覧に出す概要文(任意)"
draft: true
---
```

| 項目 | 必須 | 説明 |
|---|---|---|
| `title` | ○ | 記事タイトル |
| `date` | ○ | 公開日(`YYYY-MM-DD`)。一覧はこの日付の新しい順 |
| `category` | ○ | `学習ノート` / `AI` / `開発環境` / `雑記` のどれか。それ以外はビルドエラーになる |
| `tags` | | タグの配列。既存のタグと表記を揃える(`Claude Code` と `claude code` は同じタグとして扱われる) |
| `description` | | 一覧カードや RSS に出る概要。無ければ本文の冒頭約120文字が使われる |
| `draft` | | `true` にすると本番に出ない(`npm run dev` では表示される)。書きかけを push したいとき用 |

カテゴリを増やす・名前を変えるときは `src/site.config.ts` の `categories` を編集する。

## 3. 本文で使える書き方

### 改行

段落内の改行はそのまま改行として表示される(remark-breaks)。空行で段落が分かれる。

### 見出し

`##`(h2)と `###`(h3)が右サイドバーの目次に出る。h2・h3 が合わせて2つ以上あるときだけ目次が表示される。`#`(h1)はタイトルに使われているので本文では使わない。

### コードブロック

````md
```js title="src/index.js"
console.log('ファイル名のタブが付く');
```

```bash
# bash / sh などはターミナル風の枠になる
npm run build
```

```bash title="サーバーで実行"
# ターミナル枠にタイトルを付ける
sudo apt update
```

```js showLineNumbers {2,4-5}
// showLineNumbers で行番号、{2,4-5} で行をハイライト
const a = 1;
const b = 2;
const c = 3;
const d = 4;
```

```js ins={2} del={3}
// 追加行・削除行の表示
const after = 'new';
const before = 'old';
```
````

### 注意書き

```md
> [!NOTE]
> 補足

> [!TIP]
> ちょっとしたコツ

> [!IMPORTANT]
> 重要なこと

> [!WARNING]
> 注意

> [!CAUTION]
> 危険な操作など
```

`[!NOTE]` の付かない `>` は普通の引用になる。

### 画像

画像は `public/images/` に置いて、`/images/` から始まるパスで参照する。

```md
![代替テキスト](/images/full_backup.png)
```

### 表

通常の Markdown の表が使える。横に長い表はスマホで横スクロールになる。

## 4. 表示を確認する

```sh
npx astro dev --background   # http://localhost:4321 で確認(draft の記事も表示される)
npx astro dev stop           # 終わったら止める
npm run build            # 公開前にエラーが無いか確認
```

## 5. 公開する

main に push すると Cloudflare が自動でビルド・デプロイする。

コミットメッセージの例:

```
feat: <記事の内容や書いたきっかけ>について書いた記事を追加
```
