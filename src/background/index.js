import { getGoogleTranslate } from '@/common/googleApi';

const getCurrentTab = async () => {
	const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
	return tab;
};

const sendMessage = async () => {
	const message = {
		action: 'showTooltip'
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

const handleMessage = (data, sender, sendResponse) => {
	if (data.getTranslate) {
		getGoogleTranslate(data.getTranslate).then(sendResponse);
	}

	return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
