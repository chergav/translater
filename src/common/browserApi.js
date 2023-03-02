import { i18n, storage } from 'webextension-polyfill';
import { defaultSettings } from '@/common/settings';

const detectLanguage = async text => {
	const result = await i18n.detectLanguage(text);
	return result.isReliable ? result.languages[0].language : null;
};

const storageGet = async (key = null) => {
	const data = await storage.local.get(key);
	return data && data[key] ? data[key] : null;
};

const storageSet = async data => {
	await storage.local.set(data);
};

const getSettings = async key => {
	// eslint-disable-next-line no-prototype-builtins
	if (!defaultSettings.hasOwnProperty(key)) {
		throw new Error(`[translater] defaultSettings has no key: "${key}"`);
	}

	const setting = await storageGet(key);
	return setting ?? defaultSettings[key];
};

const storageListener = callback => {
	storage.onChanged.addListener(changes => {
		callback(changes);
	});
};

export { detectLanguage, storageGet, storageSet, getSettings, storageListener };
