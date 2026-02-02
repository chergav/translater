export default defineContentScript({
	matches: ['<all_urls>'],
	runAt: 'document_end',
	allFrames: true,
	// matchAboutBlank: true,
	matchOriginAsFallback: true,

	async main(ctx) {
		if (window.top !== window && !window.frameElement) {
			console.debug('[Translater]: skip iframe');
			return;
		}

		if (!document.body || !document.documentElement) {
			console.debug('[Translater]: document has no body');
			return;
		}

		// console.debug('[Translater]: main');

		/* @vite-ignore */
		const mod = await import(
			browser.runtime.getURL('/content-scripts/esm/content.js'),
		);
		return await mod.default(ctx);
	},
});
