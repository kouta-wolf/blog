// GitHub 形式の注意書き(> [!NOTE] など)を、アイコンとラベル付きのボックスに変換する remark プラグイン。
// remark-breaks より前に実行し、マーカー直後の改行が <br> にならないようにする

const icon = (children) => ({
	type: 'element',
	tagName: 'svg',
	properties: {
		width: 20,
		height: 20,
		viewBox: '0 0 24 24',
		fill: 'none',
		stroke: 'currentColor',
		strokeWidth: 1.8,
		strokeLinecap: 'round',
		strokeLinejoin: 'round',
		ariaHidden: 'true',
	},
	children: children.map(([tagName, properties]) => ({ type: 'element', tagName, properties, children: [] })),
});

const types = {
	note: {
		label: 'NOTE',
		icon: icon([
			['circle', { cx: 12, cy: 12, r: 9 }],
			['path', { d: 'M12 11v5' }],
			['path', { d: 'M12 8h.01' }],
		]),
	},
	tip: {
		label: 'TIP',
		icon: icon([
			['path', { d: 'M9 18h6' }],
			['path', { d: 'M10 21h4' }],
			['path', { d: 'M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z' }],
		]),
	},
	important: {
		label: 'IMPORTANT',
		icon: icon([
			['path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' }],
			['path', { d: 'M12 7v4' }],
			['path', { d: 'M12 14h.01' }],
		]),
	},
	warning: {
		label: 'WARNING',
		icon: icon([
			['path', { d: 'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z' }],
			['path', { d: 'M12 9v4' }],
			['path', { d: 'M12 17h.01' }],
		]),
	},
	caution: {
		label: 'CAUTION',
		icon: icon([
			['path', { d: 'M7.9 2h8.2L22 7.9v8.2L16.1 22H7.9L2 16.1V7.9z' }],
			['path', { d: 'M15 9l-6 6' }],
			['path', { d: 'M9 9l6 6' }],
		]),
	},
};

const MARKER = /^\[!(\w+)\][ \t]*(\r?\n)?/;

function transform(node) {
	if (!node.children) return;
	node.children.forEach(transform);
	if (node.type !== 'blockquote') return;

	const first = node.children[0];
	const text = first?.type === 'paragraph' ? first.children[0] : undefined;
	if (text?.type !== 'text') return;
	const match = text.value.match(MARKER);
	const type = match && types[match[1].toLowerCase()];
	if (!type) return;

	// マーカーを取り除き、空になった段落は消す
	text.value = text.value.slice(match[0].length);
	if (text.value === '') first.children.shift();
	if (first.children.length === 0) node.children.shift();

	const kind = match[1].toLowerCase();
	node.data = { hName: 'div', hProperties: { className: ['callout', `callout-${kind}`], role: 'note' } };
	node.children = [
		{ type: 'calloutIcon', data: { hName: 'span', hProperties: { className: ['callout-icon'] }, hChildren: [type.icon] } },
		{
			type: 'calloutBody',
			data: { hName: 'div', hProperties: { className: ['callout-body'] } },
			children: [
				{
					type: 'paragraph',
					data: { hProperties: { className: ['callout-title'] } },
					children: [{ type: 'text', value: type.label }],
				},
				...node.children,
			],
		},
	];
}

export default function remarkCallouts() {
	return (tree) => transform(tree);
}
