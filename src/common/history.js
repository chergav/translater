import { persistentStore } from '@/common/store';

let store;

// const unsubscribe =
persistentStore.subscribe(value => {
	store = value;
});

const historyAdd = historyItem => {
	if (!store.historyLength) {
		return;
	}

	historyItem.id = Date.now();

	store.history = [historyItem, ...store.history];

	if (store.history.length >= store.historyLength) {
		store.history = store.history.slice(0, store.historyLength);
	}

	console.log(store.history);

	persistentStore.set(store);
};

export { historyAdd };
