import type { Message } from '~/shared/types';
import { googleTranslate, googleTTS } from './googleApi';
import { UNINSTALL_URL } from '~/shared/constants';

export default defineBackground({
	type: 'module',
	main() {
		async function getCurrentTab() {
			const options = {
				active: true,
				lastFocusedWindow: true,
				url: ['*://*/*'],
			};
			const [tab] = await browser.tabs.query(options);
			return tab;
		}

		async function getSelectedText(tabId: number) {
			const getSelection = () => window.getSelection()?.toString();
			try {
				const injectionResults = await browser.scripting.executeScript({
					target: { tabId },
					func: getSelection,
				});
				return injectionResults[0].result;
			} catch (error) {
				console.log(error);
			}
		}

		async function openTranslater() {
			const tab = await getCurrentTab();
			if (tab && tab.id) {
				const selectedText = await getSelectedText(tab.id) || '';

				browser.tabs.sendMessage<Message>(tab.id, {
					type: 'createPopup',
					content: {
						text: selectedText,
					},
				});
			}
		}

		function handleMessage(
			message: Message,
			_sender: Browser.runtime.MessageSender,
			sendResponse: () => void,
		) {
			switch (message.type) {
				case 'getTranslate':
					googleTranslate(message.content).then(sendResponse);
					break;
				case 'getTranslateTTS':
					googleTTS(message.content).then(sendResponse);
					break;
				case 'openOptionsPage':
					browser.runtime.openOptionsPage();
					break;
				case 'openURL':
					browser.tabs.create(message.content);
					break;
				case 'openTranslater':
					openTranslater();
					break;
				default:
					console.error(`Message type "${message.type}" not found.`);
					break;
			}

			return true;
		}

		browser.runtime.onMessage.addListener(handleMessage);

		browser.contextMenus.onClicked.addListener((info, tab) => {
			if (info.menuItemId === 'translaterMenu' && info.selectionText && tab?.id) {
				browser.tabs.sendMessage<Message>(tab.id, {
					type: 'createPopup',
					content: {
						text: info.selectionText,
					},
				});
			}
		});

		browser.commands.onCommand.addListener(command => {
			switch (command) {
				case 'open-translater':
					openTranslater();
					break;
				default:
					console.error(`Command "${command}" not found.`);
					break;
			}
		});

		function createContextMenu() {
			browser.contextMenus.create({
				id: 'translaterMenu',
				title: browser.i18n.getMessage('context_menus_title'),
				contexts: ['selection'],
			});
		}

		async function injectContentScriptIntoAllTabs() {
			const tabs = await browser.tabs.query({});

			for (const tab of tabs) {
				if (!tab.url?.startsWith('http') || !tab.id) continue;

				try {
					await browser.scripting.executeScript({
						target: { tabId: tab.id },
						files: ['/content-scripts/content.js'],
					});
				} catch (error) {
					console.log(`Failed to inject into tab ${tab.id}:`, error);
				}
			}
		}

		browser.runtime.onInstalled.addListener(details => {
			switch (details.reason) {
				case browser.runtime.OnInstalledReason.INSTALL:
					createContextMenu();
					injectContentScriptIntoAllTabs();
					browser.runtime.setUninstallURL(UNINSTALL_URL);
					break;
				case browser.runtime.OnInstalledReason.UPDATE:
					injectContentScriptIntoAllTabs();
					break;
			}
		});
	},
});
