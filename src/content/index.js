import { app, createShadowElem, createApp } from './utils/appsHandler';
import { store } from './store';
import {
	isInTextField,
	getSelectedText,
	getSelectedElemRect,
	getSelectedEndCoord
} from './utils/rectUtils';

const createTrigger = event => {
	if (event.button !== 0) return; // isLeftClick
	if (app.trigger.instance) return;

	const isInTriggerElem = event.target.closest(app.trigger.tag);
	const isInPopupElem = event.target.closest(app.popup.tag);
	if (isInPopupElem || isInTriggerElem) return;

	const selectedText = getSelectedText();
	if (!selectedText.length) return;

	store.update(data => ({
		...data,
		hostname: window.location.hostname,
		isInTextField: isInTextField(),
		selectedElemRect: getSelectedElemRect(),
		selectedEndCoord: getSelectedEndCoord()
	}));

	const { customElement, root } = createShadowElem(app.trigger.tag);

	app.trigger.customElement = customElement;

	app.trigger.instance = new app.trigger.component({ target: root });
};

const createPopup = text => {
	store.update(data => ({
		...data,
		hostname: window.location.hostname,
		selectedText: text.trim() !== '' ? text : data.selectedText
	}));

	createApp('popup');
};

document.addEventListener('mouseup', createTrigger);

chrome.runtime.onMessage.addListener(message => {
	switch (message.action) {
	case 'createPopup':
		createPopup(message.content);
		break;
	default:
		console.error(`Action "${message.action}" is not found.`);
	}
});
