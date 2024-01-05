import { get } from 'svelte/store';
import { persistentStore } from '~/common/store';

const historyAppend = ({ sourceLang, targetLang, orig, trans }) => {
	const _persistentStore = get(persistentStore);
	if (!_persistentStore.historyEnable) {
		return;
	}

	const historyItem = {
		sourceLang,
		targetLang,
		orig,
		trans,
		time: Date.now()
	};

	_persistentStore.history = [historyItem, ..._persistentStore.history];

	if (_persistentStore.history.length >= _persistentStore.historyLength) {
		_persistentStore.history = _persistentStore.history.slice(0, _persistentStore.historyLength);
	}

	persistentStore.set(_persistentStore);
};

export { historyAppend };
