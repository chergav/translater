import { writable } from 'svelte/store';

const initData = {
	selectedText: null,
	translated: null,
	hostname: null,
	isInTextField: false,
	selectedElemRect: null,
	selectedEndCoord: null,
	voices: null,
	translateCache: []
};

export const store = writable(initData);
