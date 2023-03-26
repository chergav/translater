import { writable, derived } from 'svelte/store';

const initData = {
	currentApp: null,
	selectedText: null,
	hostname: null,
	isInTextField: false,
	selectedElemRect: null,
	selectedEndCoord: null,
	voices: null
};

export const store = writable(initData);

export const currentApp = derived(store, $store => $store.currentApp);
