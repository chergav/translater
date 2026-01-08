export default defineContentScript({
	matches: ['<all_urls>'],
	runAt: 'document_end',
	allFrames: true,
	matchAboutBlank: true,
	matchOriginAsFallback: true,

	async main(ctx) {
		/* @vite-ignore */
		const mod = await import(
			browser.runtime.getURL('/content-scripts/esm/content.js'),
		);
		return await mod.default(ctx);
	},
});
