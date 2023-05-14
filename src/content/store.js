import { writable, derived } from 'svelte/store';

const initData = {
	selectedText: null,
	translated: null,
	sourceLang: 'auto',
	hostname: null,
	isInTextField: false,
	selectedElemRect: null,
	selectedEndCoord: null,
	voices: null,
	cacheTranslate: [],
	cacheTTS: [],
	audioContextSource: null
};

const store = writable(initData);

const selectedText = derived(store, $store => $store.selectedText);

export { store, selectedText };
