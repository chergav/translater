import { writable, derived, get } from 'svelte/store';
import { persistentStore } from '~/common/store';
import { historyAppend } from '~/common/history';
import { getUILanguage } from '~/common/browserApi';

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
	cacheTranslate: [],
	cacheTTS: [],
	audioContextSource: null,
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
	const _store = get(store);
	const _persistentStore = get(persistentStore);

	const sentences = {};
	const targetLang = _persistentStore.targetLang;
	const selectedText = _store.selectedText;
	const sourceLang = _store.sourceLang;
	let translated;

	const cached = _store.cacheTranslate.find(
		i => i.sentences.orig === selectedText &&
		i.targetLang === targetLang &&
		i.sourceLang === sourceLang
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

		translated.sentences = sentences;
		translated.targetLang = targetLang; // for cache

		store.update(value => ({
			...value,
			cacheTranslate: [...value.cacheTranslate, translated],
			sourceLang: value.sourceLang === 'auto' ? translated.src : value.sourceLang,
			cacheIndex: -1 // last item
		}));

		historyAppend({
			sourceLang: translated.src,
			targetLang,
			orig: sentences.orig,
			trans: sentences.trans
		});
	}

	return translated;
};

const resetTranslate = () => {
	store.update(value => ({
		...value,
		selectedText: null,
		sourceLang: 'auto',
		targetLang: getUILanguage(),
		translated: {
			sourceLang: 'auto',
			spell: {},
			ld_result: { srclangs: ['auto'] },
			sentences: { orig: '', trans: '' }
		},
		cacheIndex: 0
	}));
};

async function getTranslate() {
	const _store = get(store);

	if (!_store.selectedText) {
		resetTranslate();
		return;
	}

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
	} else {
		resetTranslate();
	}
});

export { store, selectedText, sourceLang, getTranslate, resetTranslate };
