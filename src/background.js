import storage from './common/storage.js';

const translateOnGT = async text => {
	const { targetLang } = await storage.get('settings');
	const url = `
		https://translate.google.com/?sl=auto
		&tl=${targetLang}
		&text=${encodeURIComponent(text)}
	`;
	chrome.tabs.create({ url: url });
};

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: 'mainMenu',
		title: 'Open in Google Translate',
		// chrome.i18n.getMessage('menu_title'),
		// not work in service worker; wait chrome 100v
		// https://bugs.chromium.org/p/chromium/issues/detail?id=1268098
		contexts: ['selection'],
	});
});

chrome.contextMenus.onClicked.addListener((info, _) => {
	console.log(info, _);
	if (info.menuItemId === 'mainMenu') {
		translateOnGT(info.selectionText);
	}
});
