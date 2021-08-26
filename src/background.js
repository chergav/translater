import { Storage } from './common/storage.js';
import { settings } from './common/settings.js';

let { targetLang } = await Storage.get();

const translateOnGT = text => {
	const url = `
		https://translate.google.com/?sl=auto
		&tl=${targetLang}
		&text=${encodeURIComponent(text)}
	`;
	chrome.tabs.create({ url: url });
};

const menuCreate = () =>
	chrome.contextMenus.create({
		title: chrome.i18n.getMessage('menu_title'),
		contexts: ["selection"],
		onclick: (info, _) => translateOnGT(info.selectionText)
	});

const handleMessage = (message, sender, sendResponse) => {
	if (message === 'settings') {
		Storage.get().then(sendResponse);
	} else if (message === 'languages'){
		sendResponse(settings.languages)
	}
	return true;
};

chrome.storage.onChanged.addListener(i => ({ targetLang } = i.settings.newValue));
chrome.runtime.onMessage.addListener(handleMessage);

menuCreate();
