// サイト全体の設定。プロフィールやカテゴリはここを書き換えて差し替える

export const site = {
	title: 'HexWolf Blog',
	url: 'https://blog.hexwolf.org',
	description: '日々の学びや雑記を書いている個人ブログです。',
	author: 'オオカミ',
	license: {
		name: 'CC BY-NC-SA 4.0',
		url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ja',
	},
} as const;

export const profile = {
	name: 'オオカミ',
	// ひとこと紹介(サイドバーのプロフィールカードに表示)
	bio: '好きな言語はRust。プログラミング学習中です。',
	// アバター画像のパス(例: '/images/avatar.png')。未設定なら avatarText を表示する
	avatar: undefined as string | undefined,
	avatarText: '狼',
	links: {
		github: 'https://github.com/kouta-wolf',
		website: 'https://hexwolf.org',
	},
};

// カテゴリの一覧。記事の frontmatter の category には name を書く。slug は URL に使う
export const categories = [
	{ name: '学習ノート', slug: 'study', description: 'プログラミングや言語の話題を雑多にまとめた学習メモ' },
	{ name: 'AI', slug: 'ai', description: 'AIとの付き合い方や使ってみた感想' },
	{ name: '開発環境', slug: 'dev-env', description: 'エディタやOSなど、開発環境まわりの話' },
	{ name: '雑記', slug: 'diary', description: '日記や近況など' },
] as const;

export type CategoryName = (typeof categories)[number]['name'];

export const categoryNames = categories.map((c) => c.name) as [CategoryName, ...CategoryName[]];

export function getCategory(name: CategoryName) {
	return categories.find((c) => c.name === name)!;
}
