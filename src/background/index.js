import { getTranslate } from '@/common/googleApi';

const getCurrentTab = async () => {
	const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
	return tab;
};

const sendMessage = async () => {
	const message = {
		action: 'showPopup'
	};

	const tab = await getCurrentTab();

	chrome.tabs.sendMessage(tab.id, message);
};

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: 'translaterMenu',
		title: chrome.i18n.getMessage('context_menus_title'),
		contexts: ['selection']
	});
});

chrome.contextMenus.onClicked.addListener(info => {
	if (info.menuItemId === 'translaterMenu') {
		sendMessage();
	}
});

const handleMessage = (message, sender, sendResponse) => {
	switch (message.type) {
	case 'getTranslate':
		getTranslate(message.content).then(sendResponse);
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
