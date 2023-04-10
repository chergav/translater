import { persistentStore } from '~/common/store';

let store;

persistentStore.subscribe(value => {
	store = value;
});

const historyAdd = historyItem => {
	if (!store.historyLength) {
		return;
	}

	historyItem.time = Date.now();

	store.history = [historyItem, ...store.history];

	if (store.history.length >= store.historyLength) {
		store.history = store.history.slice(0, store.historyLength);
	}

	persistentStore.set(store);
};

export { historyAdd };
