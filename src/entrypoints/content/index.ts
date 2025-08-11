export default defineContentScript({
	matches: ['<all_urls>'],
	runAt: 'document_idle',
	allFrames: true,
	matchAboutBlank: true,
	matchOriginAsFallback: true,

	async main(ctx) {
		const rect = document.body.getBoundingClientRect();
		if (rect.width < 10 || rect.height < 10) {
			console.log('Skipping tiny iframe');
			return;
		}

		if (window.location.href === 'about:blank') {
			console.log('Skipping about:blank iframe');
			return;
		}

		if (
			window.getComputedStyle &&
    		window.getComputedStyle(document.body).display === 'none'
		) {
			console.log('Skipping hidden iframe');
			return;
		}

		if (
			document.body && document.body.textContent &&
			document.body.textContent.trim().length < 5
		) {
			console.log('Skipping frame with minimal content');
			return;
		}

		/* @vite-ignore */
		const mod = await import(
			browser.runtime.getURL('/content-scripts/esm/content.js'),
		);
		return await mod.default(ctx);
	},
});
