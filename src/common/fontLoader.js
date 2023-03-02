import { runtime } from 'webextension-polyfill';

export const loadFont = async () => {
	const font = new FontFace(
		'Inter Variable',
		`url(${runtime.getURL('/src/fonts/Inter.var.woff2')}) format('woff2'),
		url(${runtime.getURL('/src/fonts/Inter.var.ttf')}) format('truetype')`,
		{
			display: 'swap',
			weight: '100 1000'
		}
	);

	await font.load();

	document.fonts.add(font);
};
