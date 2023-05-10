import { writable } from 'svelte/store';

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

export const store = writable(initData);
