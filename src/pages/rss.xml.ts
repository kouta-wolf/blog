import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getExcerpt, getPublishedPosts, postHref } from '../lib/posts';
import { site } from '../site.config';

export async function GET(context: APIContext) {
	const posts = await getPublishedPosts();
	return rss({
		title: site.title,
		description: site.description,
		site: context.site!,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: getExcerpt(post),
			link: postHref(post),
			categories: [post.data.category, ...(post.data.tags ?? [])],
		})),
		customData: '<language>ja</language>',
	});
}
