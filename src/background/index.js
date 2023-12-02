import { googleTranslate, googleTTS } from '~/common/googleApi';
import { openOptionsPage } from '~/common/browserApi';

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
	if (info.menuItemId === 'translaterMenu' && info.selectionText) {
		sendMessage(tab.id, { action: 'createPopup', content: info.selectionText });
	}
});

const getCurrentTab = async () => {
	const options = {
		active: true,
		lastFocusedWindow: true,
		url: ['*://*/*']
	};
	let [tab] = await chrome.tabs.query(options);
	return tab;
};

const getSelectedText = async tabId => {
	const getSelection = () => window.getSelection().toString();
	try {
		const injectionResults = await chrome.scripting.executeScript({
			target: { tabId },
			func: getSelection
		});
		return injectionResults[0].result;
	} catch (error) {
		return null;
	}
};

const openTranslater = async () => {
	const tab = await getCurrentTab();
	if (tab) {
		const selectedText = await getSelectedText(tab.id);

		if (selectedText !== null) {
			sendMessage(tab.id, { action: 'createPopup', content: selectedText });
		}
	}
};

const handleMessage = (message, _sender, sendResponse) => {
	switch (message.type) {
	case 'getTranslate':
		googleTranslate(message.content).then(sendResponse);
		break;
	case 'getTranslateTTS':
		googleTTS(message.content).then(sendResponse);
		break;
	case 'openOptionsPage':
		openOptionsPage();
		break;
	case 'openTranslater':
		openTranslater();
		break;
	default:
		console.error(`Message type "${message.type}" not found.`);
		break;
	}

	return true;
};

chrome.runtime.onMessage.addListener(handleMessage);

chrome.commands.onCommand.addListener(command => {
	switch (command) {
	case 'open-translater':
		openTranslater();
		break;
	default:
		console.error(`Command "${command}" not found.`);
		break;
	}
});
