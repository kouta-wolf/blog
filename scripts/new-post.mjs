// 新しい記事のひな形を作ってエディタで開く。
// 使い方: npm run new            (対話で入力)
//         npm run new -- sql-8   (ファイル名を先に指定)
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { categories } from '../src/site.config.ts';

const POSTS_DIR = join(import.meta.dirname, '..', 'src', 'content', 'posts');

// 既存記事で使われているタグを、表記揺れ防止のため候補として表示する
function existingTags() {
	const tags = new Set();
	for (const file of readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))) {
		const line = readFileSync(join(POSTS_DIR, file), 'utf8').match(/^tags:\s*\[(.*)\]\s*$/m);
		line?.[1].split(',').forEach((t) => {
			const tag = t.trim().replace(/^["']|["']$/g, '');
			if (tag) tags.add(tag);
		});
	}
	return [...tags].sort((a, b) => a.localeCompare(b, 'ja'));
}

// 記事の日付は日本時間の今日
function today() {
	return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date());
}

const rl = createInterface({ input: process.stdin, output: process.stdout });

async function askSlug(initial) {
	let slug = initial;
	for (;;) {
		if (!slug) slug = (await rl.question('ファイル名(URL になる。例: sql-8): ')).trim();
		if (!/^[a-z0-9_-]+$/.test(slug)) {
			console.log('  半角英小文字・数字・ハイフン・アンダースコアだけ使えます');
		} else if (existsSync(join(POSTS_DIR, `${slug}.md`))) {
			console.log(`  ${slug}.md はすでにあります`);
		} else {
			return slug;
		}
		slug = '';
	}
}

async function askTitle() {
	for (;;) {
		const title = (await rl.question('タイトル: ')).trim();
		if (title) return title;
	}
}

async function askCategory() {
	categories.forEach((c, i) => console.log(`  ${i + 1}) ${c.name}`));
	for (;;) {
		const n = Number((await rl.question('カテゴリ番号: ')).trim());
		if (categories[n - 1]) return categories[n - 1].name;
	}
}

async function askTags() {
	console.log(`  既存のタグ: ${existingTags().join(', ')}`);
	const input = await rl.question('タグ(カンマ区切り、空でもよい): ');
	return input
		.split(/[,、]/)
		.map((t) => t.trim())
		.filter(Boolean);
}

const slug = await askSlug(process.argv[2]?.trim());
const title = await askTitle();
const category = await askCategory();
const tags = await askTags();
rl.close();

const frontmatter = [
	'---',
	`title: ${JSON.stringify(title)}`,
	`date: ${today()}`,
	`category: ${JSON.stringify(category)}`,
	`tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]`,
	'---',
	'',
	'',
].join('\n');

const path = join(POSTS_DIR, `${slug}.md`);
writeFileSync(path, frontmatter);
console.log(`\n作成しました: src/content/posts/${slug}.md`);

// 本文の書き出し位置(最終行)にカーソルを置いて開く
const editor = process.env.EDITOR || 'nvim';
spawnSync(editor, ['+', path], { stdio: 'inherit' });
