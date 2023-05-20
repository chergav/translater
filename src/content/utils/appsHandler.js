import AppTrigger from '../AppTrigger.svelte';
import AppPopup from '../AppPopup.svelte';
import AppSettings from '../AppSettings.svelte';
import css from '~/common/global.css?inline';

const app = {
	trigger: {
		component: AppTrigger,
		tag: 'translater-inline-trigger',
		instance: null,
		customElement: null
	},
	popup: {
		component: AppPopup,
		tag: 'translater-inline-popup',
		instance: null,
		customElement: null
	},
	settings: {
		component: AppSettings,
		tag: 'translater-inline-settings',
		instance: null,
		customElement: null
	}
};

const createShadowElem = tag => {
	const customElement = document.createElement(tag);
	const root = document.createElement('div');
	root.classList.add('translater-shadow-root');
	const styleEl = document.createElement('style');
	const shadowDOM = customElement.attachShadow({ mode: 'open' }) || customElement;
	styleEl.textContent = css;
	shadowDOM.appendChild(styleEl);
	shadowDOM.appendChild(root);
	document.body.appendChild(customElement);
	return { customElement, root };
};

const createApp = name => {
	if (app[name].instance) return;

	const { customElement, root } = createShadowElem(app[name].tag);

	app[name].customElement = customElement;

	app[name].instance = new app[name].component({
		target: root
	});
};

const destroyApp = name => {
	if (app[name].instance) {
		app[name].instance.$destroy();
		app[name].instance = null;
		app[name].customElement.remove();
	}
};

export { app, createShadowElem, createApp, destroyApp };
