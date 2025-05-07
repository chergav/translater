export default defineContentScript({
	matches: ['<all_urls>'],
	runAt: 'document_idle',

	async main(ctx) {
		/* @vite-ignore */
		const mod = await import(
			browser.runtime.getURL('/content-scripts/esm/content.js'),
		);
		return await mod.default(ctx);
	},
});
