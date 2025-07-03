import { ContentScriptContext } from 'wxt/utils/content-script-context';
import { splitShadowRootCss } from 'wxt/utils/split-shadow-root-css';
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
import { CUSTOM_ELEMENT_TAG } from '~/shared/constants';
import App from './App.svelte';
import { mount, unmount } from 'svelte';
import '~/assets/tailwind.css';
import '@fontsource-variable/inter';

export default async (ctx: ContentScriptContext) => {
	const stylesText = await fetch(
		browser.runtime.getURL('/content-scripts/esm/content.css'),
	).then(res => res.text());
	const ui = await createShadowRootUi(ctx, {
		name: CUSTOM_ELEMENT_TAG,
		position: 'inline',
		anchor: 'body',
		isolateEvents: true,
		onMount: (container, shadow) => {
			const instanceId = Math.random().toString(36).substring(2, 15);
			const { shadowCss, documentCss } = splitShadowRootCss(stylesText.trim());

			const style = document.createElement('style');
			style.textContent = shadowCss;
			shadow.querySelector('head')!.append(style);

			if (
				documentCss &&
				!document.querySelector(`style[wxt-shadow-root-document-styles="${instanceId}"]`,
				)
			) {
				const style = document.createElement('style');
				style.textContent = documentCss;
				style.setAttribute('wxt-shadow-root-document-styles', instanceId);
				(document.head ?? document.body).append(style);
			}

			return mount(App, {
				target: container,
			});
		},
		onRemove: app => {
			if (app) unmount(app);
		},
	});
	ui.mount();
};
