import { writable } from 'svelte/store';

const initData = {
	selectedText: null,
	textFieldElem: null,
	voices: null
};

export const store = writable(initData);
