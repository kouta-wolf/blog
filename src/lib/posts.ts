import { getCollection, type CollectionEntry } from 'astro:content';

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
