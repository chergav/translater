import { defaultSettings } from '~/common/settings';

const getUILanguage = () => chrome.i18n.getUILanguage();

const detectLanguage = async text => {
	const result = await chrome.i18n.detectLanguage(text);
	return result.isReliable ? result.languages[0].language : null;
};

const storageGet = async () => await chrome.storage.local.get(defaultSettings);

const storageSet = async data => {
	await chrome.storage.local.set(data);
};

const storageListener = callback => {
	chrome.storage.onChanged.addListener(changes => {
		callback(changes);
	});
};

const getMessage = msg => chrome.i18n.getMessage(msg);

const getURL = path => chrome.runtime.getURL(path);

export { getUILanguage, detectLanguage, storageGet, storageSet, storageListener, getMessage, getURL };
