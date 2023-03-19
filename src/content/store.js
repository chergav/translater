import { writable } from 'svelte/store';

const initData = {
	selectedText: null,
	isInTextField: false,
	selectedElemRect: null,
	selectedEndCoord: null,
	voices: null
};

export const store = writable(initData);
