import { tabs, runtime, contextMenus, i18n } from 'webextension-polyfill';
import { getGoogleTranslate } from '@/common/googleApi';

const getCurrentTab = async () => {
	const [tab] = await tabs.query({ active: true, lastFocusedWindow: true });
	return tab;
};

const sendMessage = async () => {
	const message = {
		action: 'showTooltip'
	};

	const tab = await getCurrentTab();

	tabs.sendMessage(tab.id, message);
};

runtime.onInstalled.addListener(() => {
	contextMenus.create({
		id: 'translaterMenu',
		title: i18n.getMessage('context_menus_title'),
		contexts: ['selection']
	});
});

contextMenus.onClicked.addListener(info => {
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

runtime.onMessage.addListener(handleMessage);
