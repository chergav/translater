import type { HistoryItem } from '~/shared/types';
import { storage } from '~/shared/storage.svelte';

export function historyAddItem({ sourceLang, targetLang, orig = '', trans = '', time }: HistoryItem) {
	if (!storage.settings.historyEnable) {
		return;
	}

	const historyItem = {
		sourceLang,
		targetLang,
		orig,
		trans,
		time,
	};

	storage.settings.history.push(historyItem);

	if (storage.settings.history.length >= storage.settings.historyLength) {
		storage.settings.history = storage.settings.history.slice(0, storage.settings.historyLength);
	}
}
