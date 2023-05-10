import { googleTranslate, googleTTS } from '~/common/googleApi';

const sendMessage = async (tabId, message) => {
	try {
		await chrome.tabs.sendMessage(tabId, message);
	} catch {
		// if content script not loaded
	}
};

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: 'translaterMenu',
		title: chrome.i18n.getMessage('context_menus_title'),
		contexts: ['selection']
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === 'translaterMenu') {
		sendMessage(tab.id, { action: 'showPopup' });
	}
});

const getTranslate = async requestObj => {
	const gt = await googleTranslate(requestObj);

	return gt;
};

const handleMessage = (message, sender, sendResponse) => {
	switch (message.type) {
	case 'getTranslate':
		getTranslate(message.content).then(sendResponse);
		break;
	case 'getTranslateTTS':
		googleTTS(message.content).then(sendResponse);
		break;
	case 'openOptionsPage':
		chrome.tabs.create({
			url: `${chrome.runtime.getURL('src/options/index.html')}${message.content.hash}`
		});
		break;
	default:
		console.error(`Error message type "${message.type}".`);
		break;
	}

	return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
