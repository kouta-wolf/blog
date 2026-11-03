import { getCollection, type CollectionEntry } from 'astro:content';
import { getCategory, type CategoryName } from '../site.config';

export type Post = CollectionEntry<'posts'>;

// 公開対象の記事を新しい順で返す(開発時は下書きも含める)
export async function getPublishedPosts(): Promise<Post[]> {
	const posts = await getCollection('posts', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

// YYYY-MM-DD(ビルド環境のタイムゾーンに左右されないよう UTC で組み立てる)
export function formatDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

export function postHref(post: Post): string {
	return `/posts/${post.id}/`;
}

export function categoryHref(name: CategoryName): string {
	return `/categories/${getCategory(name).slug}/`;
}

// タグ名を URL 用にする。英字は小文字、空白はハイフンにし、日本語はそのまま使う
export function tagSlug(tag: string): string {
	return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

export function tagHref(tag: string): string {
	return `/tags/${tagSlug(tag)}/`;
}

// description が無い記事用に、本文の冒頭から Markdown 記法を取り除いた抜粋を作る
export function getExcerpt(post: Post, length = 120): string {
	if (post.data.description) return post.data.description;
	const text = (post.body ?? '')
		.replace(/^(`{3,}|~{3,})[\s\S]*?^\1/gm, '') // コードブロック
		.replace(/^#{1,6}\s.*$/gm, '') // 見出し
		.replace(/^\s*>\s?(\[!\w+\])?/gm, '') // 引用・注意書き
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 画像
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // リンク
		.replace(/<[^>]+>/g, '') // HTML
		.replace(/^\s*([-*+]|\d+\.)\s+/gm, '') // リスト記号
		.replace(/^\s*\|.*\|\s*$/gm, '') // 表
		.replace(/^\s*(-{3,}|\*{3,})\s*$/gm, '') // 区切り線
		.replace(/[*_~`]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	return text.length > length ? `${text.slice(0, length)}…` : text;
}

// 読了時間の目安(分)。日本語は1分あたり約500文字として、コードブロックは除いて数える
export function getReadingMinutes(post: Post): number {
	const text = (post.body ?? '').replace(/^(`{3,}|~{3,})[\s\S]*?^\1/gm, '').replace(/\s+/g, '');
	return Math.max(1, Math.round(text.length / 500));
}
