import App from './App.svelte';
import { mount, unmount } from 'svelte';
import { CUSTOM_ELEMENT_TAG } from '~/shared/constants';
import '~/assets/tailwind.css';

// will use it when wxt will support esm modules in content script
export default defineContentScript({
	matches: ['<all_urls>'],
	runAt: 'document_idle',
	cssInjectionMode: 'ui',

	async main(ctx) {
		const ui = await createShadowRootUi(ctx, {
			name: CUSTOM_ELEMENT_TAG,
			position: 'inline',
			anchor: 'body',
			inheritStyles: false,
			isolateEvents: true,
			onMount: container => {
				return mount(App, {
					target: container,
				});
			},
			onRemove: app => {
				if (app) unmount(app);
			},
		});
		ui.mount();
	},
});
