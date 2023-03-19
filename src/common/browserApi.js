import { defaultSettings } from '@/common/settings';

const detectLanguage = async text => {
	const result = await chrome.i18n.detectLanguage(text);
	return result.isReliable ? result.languages[0].language : null;
};

const storageGet = async (key = null) => {
	const data = await chrome.storage.local.get(key);
	return data && Object.hasOwn(data, key) ? data[key] : null;
};

const storageSet = async data => {
	await chrome.storage.local.set(data);
};

const getSettings = async key => {
	if (!Object.hasOwn(defaultSettings, key)) {
		throw new Error(`[translater] defaultSettings has no key: "${key}"`);
	}

	const setting = await storageGet(key);
	return setting ?? defaultSettings[key];
};

const storageListener = callback => {
	chrome.storage.onChanged.addListener(changes => {
		callback(changes);
	});
};

const getMessage = msg => chrome.i18n.getMessage(msg);

const getURL = path => chrome.runtime.getURL(path);

export { detectLanguage, storageGet, storageSet, getSettings, storageListener, getMessage, getURL };
