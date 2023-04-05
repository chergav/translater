import { app, createShadowElem, createApp } from './appsHandler';
import { store } from './store';
import {
	isInTextField,
	getSelectedText,
	getSelectedElemRect,
	getSelectedEndCoord
} from './rectUtils';

const createTrigger = event => {
	const isLeftClick = event.button === 0;

	if (!isLeftClick) {
		return;
	}

	if (app.trigger.instance) {
		return;
	}

	const isInTriggerElem = event.target.closest(app.trigger.tag);
	const isInPopupElem = event.target.closest(app.popup.tag);

	if (isInPopupElem || isInTriggerElem) {
		return;
	}

	const selectedText = getSelectedText();

	if (!selectedText.length) {
		return;
	}

	store.update(data => ({
		...data,
		selectedText,
		hostname: window.location.hostname,
		isInTextField: isInTextField(),
		selectedElemRect: getSelectedElemRect(),
		selectedEndCoord: getSelectedEndCoord()
	}));

	const { customElement, root } = createShadowElem(app.trigger.tag);

	app.trigger.customElement = customElement;

	app.trigger.instance = new app.trigger.component({
		target: root
	});
};

document.addEventListener('mouseup', createTrigger);

chrome.runtime.onMessage.addListener(message => {
	switch (message.action) {
	case 'showPopup':
		createApp('popup');
		break;
	default:
		console.error(`Action "${message.action}" is not found.`);
	}
});
