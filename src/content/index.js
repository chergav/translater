import AppTrigger from './AppTrigger.svelte';
import AppTooltip from './AppTooltip.svelte';
import css from '@/common/global.css?inline';
import { store } from './store';
import { getSelectedText } from './utils';

const app = {
	trigger: null,
	tooltip: null
};

const triggerTag = 'gav-translate-trigger';
const tooltipTag = 'gav-translate-tooltip';

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

const removeTooltip = () => {
	app.tooltip.$destroy();
	document.querySelector(tooltipTag).remove();
};

const removeTooltipInside = event => {
	const isLeftClick = event.button === 0;
	if (!isLeftClick) return;

	const closeTooltip = event.target.closest('#close-tooltip');
	if (!closeTooltip) return;

	removeTooltip();
};

const removeTooltipOutside = event => {
	const isLeftClick = event.button === 0;
	if (!isLeftClick) return;

	const tooltipElem = document.querySelector(tooltipTag);
	if (!tooltipElem) return;

	const isInTriggerElem = event.target.closest(triggerTag);
	if (isInTriggerElem) return;

	const isInTooltipElem = event.target.closest(tooltipTag);
	if (isInTooltipElem) return;

	removeTooltip();
};

const createTooltip = event => {
	if (event) {
		const triggerButton = event.target.closest('#trigger-button');
		if (!triggerButton) return;
	}

	const tooltipContainer = document.querySelector(tooltipTag);

	if (!tooltipContainer) {
		const root = createShadowElem(tooltipTag);

		root.addEventListener('click', removeTooltipInside);

		app.tooltip = new AppTooltip({
			target: root
		});
	}
};

const createTrigger = event => {
	const isLeftClick = event.button === 0;
	if (!isLeftClick) return;

	const isInTriggerElem = event.target.closest(triggerTag);
	if (isInTriggerElem) return;

	const isInTooltipElem = event.target.closest(tooltipTag);
	if (isInTooltipElem) return;

	const selectedText = getSelectedText();
	if (!selectedText.length) return;

	store.update(data => ({
		...data,
		selectedText
	}));

	const root = createShadowElem(triggerTag);

	root.addEventListener('click', createTooltip);

	app.trigger = new AppTrigger({
		target: root
	});
};

const removeTrigger = event => {
	const isLeftClick = event.button === 0;
	if (!isLeftClick) return;

	const isInTriggerElem = event.target.closest(triggerTag);
	if (isInTriggerElem) return;

	const triggerElem = document.querySelector(triggerTag);

	if (triggerElem) {
		app.trigger.$destroy();
		triggerElem.remove();
		document.getSelection().removeAllRanges();
	}
};

// console.log(`[translater] DEV: ${__DEV__}`);

document.addEventListener('mouseup', createTrigger);
document.addEventListener('mousedown', removeTrigger);
document.addEventListener('mousedown', removeTooltipOutside);

chrome.runtime.onMessage.addListener(
	message => {
		switch (message.action) {
		case 'showTooltip':
			createTooltip();
			break;
		default:
			console.error(`Action "${message.action}" not found.`);
		}
	}
);
