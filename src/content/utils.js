import { get } from 'svelte/store';
import { store } from './store';

const isInTextField = () => ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);

const getSelectedText = () => {
	let selectedText;

	if (isInTextField()) {
		const textField = document.activeElement;
		const start = textField.selectionStart;
		const end = textField.selectionEnd;

		selectedText = textField.value.substring(start, end);
	} else {
		selectedText = document.getSelection().toString().trim();
	}

	return selectedText;
};

const getSelectedElemRect = () => {
	const { textFieldElem } = get(store);
	let element;

	if (textFieldElem) {
		element = textFieldElem;
	} else {
		const selection = document.getSelection();

		if (!selection.rangeCount || !selection.toString()) {
			return {};
		}

		element = selection.getRangeAt(0).cloneRange();
	}

	return element.getBoundingClientRect();
};

// returns coord of the end of the selection
const getSelectedEndCoord = () => {
	let element, lastRect;

	if (isInTextField()) {
		element = document.activeElement;

		store.update(data => ({
			...data,
			textFieldElem: element
		}));
	} else {
		store.update(data => ({
			...data,
			textFieldElem: null
		}));

		const selection = document.getSelection();

		if (!selection.rangeCount) return null;

		element = selection.getRangeAt(0).cloneRange();

		const rectsNoCollapse = element.getClientRects();

		lastRect = rectsNoCollapse[rectsNoCollapse.length - 1];

		element.collapse(false);
	}

	const rects = element.getClientRects();

	// if DOMRectList empty
	if (!rects.length) return lastRect;

	return element.getBoundingClientRect();
};

export { isInTextField, getSelectedText, getSelectedElemRect, getSelectedEndCoord };
