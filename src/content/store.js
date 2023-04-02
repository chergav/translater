import { writable } from 'svelte/store';

const initData = {
	selectedText: null,
	hostname: null,
	isInTextField: false,
	selectedElemRect: null,
	selectedEndCoord: null,
	voices: null
};

export const store = writable(initData);
