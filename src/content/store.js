import { writable, derived, get } from 'svelte/store';
import { persistentStore } from '~/common/store';
import { historyAdd } from '~/common/history';

const initData = {
	selectedText: null,
	translated: null,
	pending: false,
	error: false,
	sourceLang: 'auto',
	hostname: null,
	isInTextField: false,
	selectedElemRect: null,
	selectedEndCoord: null,
	voices: null,
	cacheTranslate: [],
	cacheTTS: [],
	audioContextSource: null,
	activeTab: 0,
	cacheIndex: -1
};

const store = writable(initData);

const selectedText = derived(store, $store => $store.selectedText);
const sourceLang = derived(store, $store => $store.sourceLang);

const fetchTranslate = async (sourceLang, targetLang, selectedText) => {
	try {
		const content = {
			sourceLang,
			targetLang,
			selectedText
		};

		const response = await chrome.runtime.sendMessage({
			type: 'getTranslate',
			content
		});

		return response;
	} catch (error) {
		console.error('Error occurred while fetching translation: ', error);
		throw error;
	}
};

const getGTranslate = async () => {
	const $store = get(store);
	const $persistentStore = get(persistentStore);

	const sentences = {};
	const targetLang = $persistentStore.targetLang;
	const selectedText = $store.selectedText;
	const sourceLang = $store.sourceLang;
	let translated;

	const cached = $store.cacheTranslate.find(
		i => i.sentences.orig === selectedText && i.targetLang === targetLang && i.src === sourceLang
	);

	if (cached) {
		translated = cached;
		store.update(value => ({
			...value,
			sourceLang: cached.src
		}));
		persistentStore.update(value => ({
			...value,
			targetLang: cached.targetLang
		}));
	} else {
		translated = await fetchTranslate(sourceLang, targetLang, selectedText);

		['orig', 'trans', 'translit', 'src_translit'].forEach(i => {
			sentences[i] = translated.sentences.reduce((a, v) => (a += v[i] ?? ''), '');
		});

		// store.update(value => ({
		// 	...value,
		// 	sourceLang: value.sourceLang === 'auto' ? translated.src : value.sourceLang
		// }));

		translated.sentences = sentences;
		translated.targetLang = targetLang;

		store.update(value => ({
			...value,
			cacheTranslate: [...value.cacheTranslate, translated],
			sourceLang: value.sourceLang === 'auto' ? translated.src : value.sourceLang,
			cacheIndex: -1
		}));

		historyAdd({
			sourceLang: $store.sourceLang,
			targetLang,
			orig: sentences.orig,
			trans: sentences.trans
		});
	}

	return translated;
};

async function getTranslate() {
	store.update(value => ({
		...value,
		pending: true,
		error: false
	}));

	try {
		const response = await getGTranslate();
		store.update(value => ({
			...value,
			translated: response
		}));
	} catch (error) {
		store.update(value => ({
			...value,
			error
		}));
	}

	store.update(value => ({
		...value,
		pending: false
	}));
}

selectedText.subscribe(text => {
	if (text) {
		getTranslate();
	}
});

export { store, selectedText, sourceLang, getTranslate };
