import { persistentStore } from '~/common/store';

let store;

persistentStore.subscribe(value => {
	store = value;
});

const historyAdd = ({ sourceLang, targetLang, orig, trans }) => {
	if (!store.historyEnable) {
		return;
	}

	const historyItem = {
		sourceLang,
		targetLang,
		orig,
		trans,
		time: Date.now()
	};

	store.history = [historyItem, ...store.history];

	if (store.history.length >= store.historyLength) {
		store.history = store.history.slice(0, store.historyLength);
	}

	persistentStore.set(store);
};

export { historyAdd };
