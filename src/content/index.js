import AppTrigger from './AppTrigger.svelte';
import AppPopup from './AppPopup.svelte';
import AppSettings from './AppSettings.svelte';
import css from '@/common/global.css?inline';
import { store, currentApp } from './store';
import { isInTextField, getSelectedText, getSelectedElemRect, getSelectedEndCoord } from './utils';

export const apps = {
	trigger: {
		app: null,
		tag: 'g-translater-trigger'
	},
	popup: {
		app: null,
		tag: 'g-translater-popupp'
	},
	settings: {
		app: null,
		tag: 'g-translater-settings'
	}
};

const createShadowElem = tag => {
	const container = document.createElement(tag);
	const root = document.createElement('div');
	const styleEl = document.createElement('style');
	const shadowDOM = container.attachShadow({ mode: __DEV__ ? 'open' : 'closed' }) || container;
	styleEl.textContent = css;
	shadowDOM.appendChild(styleEl);
	shadowDOM.appendChild(root);
	document.body.appendChild(container);
	return root;
};

const removeApps = () => {
	['popup', 'settings'].forEach(i => {
		if (apps[i].app) {
			apps[i].app.$destroy();
			apps[i].app = null;
			document.querySelector(apps[i].tag).remove();
		}
	});
};

const createPopup = () => {
	const root = createShadowElem(apps.popup.tag);

	apps.popup.app = new AppPopup({
		target: root
	});
};

const createSettings = () => {
	const root = createShadowElem(apps.settings.tag);

	apps.settings.app = new AppSettings({
		target: root
	});
};

const appHandler = app => {
	removeApps();

	switch (app) {
	case 'popup':
		createPopup();
		break;
	case 'settings':
		createSettings();
		break;
	default:
		console.error(`App: "${app}" is not exist.`);
	}
};

const createTrigger = event => {
	const isLeftClick = event.button === 0;
	if (!isLeftClick) return;

	const isInTriggerElem = event.target.closest(apps.trigger.tag);
	if (isInTriggerElem) return;

	const isInPopupElem = event.target.closest(apps.popup.tag);
	if (isInPopupElem) return;

	const selectedText = getSelectedText();
	if (!selectedText.length) return;

	store.update(data => ({
		...data,
		selectedText,
		hostname: window.location.hostname,
		isInTextField: isInTextField(),
		selectedElemRect: getSelectedElemRect(),
		selectedEndCoord: getSelectedEndCoord()
	}));

	const root = createShadowElem(apps.trigger.tag);

	apps.trigger.app = new AppTrigger({
		target: root
	});
};

currentApp.subscribe(app => {
	if (app) {
		appHandler(app);
	} else {
		removeApps();
	}
});

document.addEventListener('mouseup', createTrigger);

chrome.runtime.onMessage.addListener(
	message => {
		switch (message.action) {
		case 'showPopup':
			store.update(data => ({
				...data,
				currentApp: 'popup'
			}));
			break;
		default:
			console.error(`Action "${message.action}" is not found.`);
		}
	}
);
