import type { Message } from '~/types';
import { googleTranslate, googleTTS } from './providers/google';
import { INSTALL_URL, getUninstallUrl } from '~/shared/constants';
import { TranslationService } from './services/TranslationService';

export default defineBackground({
	type: 'module',
	main() {
		const translationService = new TranslationService();
		translationService.start();

		async function getCurrentTab() {
			const options = {
				active: true,
				lastFocusedWindow: true,
				url: ['<all_urls>'],
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			sendResponse: (response?: any) => void,
		) {
			switch (message.type) {
				case 'getTranslate':
					googleTranslate(message.content)
						.then(sendResponse)
						.catch(error => sendResponse({ error: error.message }));
					break;
				case 'getTranslateTTS':
					googleTTS(message.content).then(sendResponse);
					break;
				case 'openOptionsPage':
					browser.runtime.openOptionsPage();
					break;
				case 'openURL':
					browser.tabs.create({ url: message.content.url });
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

		browser.contextMenus.onClicked.addListener(async (info, tab) => {
			if (info.menuItemId === 'translaterMenu' && info.selectionText) {
				let tabId = tab?.id;

				// Workaround for Edge, Opera PDF viewer bug with negative tab IDs
				if (!tabId || tabId < 0) {
					console.debug('Invalid tab ID (PDF viewer bug):', tabId);
					const currentTab = await getCurrentTab();
					tabId = currentTab?.id;
				}

				if (!tabId || tabId < 0) {
					console.error('Could not determine valid tab ID');
					return;
				}

				await browser.tabs.sendMessage<Message>(tabId, {
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

		browser.runtime.onInstalled.addListener(() => {
			browser.contextMenus.create({
				id: 'translaterMenu',
				title: browser.i18n.getMessage('context_menus_title'),
				contexts: ['selection'],
			});
		});

		async function injectContentScript(tabId: number) {
			try {
				await browser.scripting.executeScript({
					target: { tabId },
					files: ['/content-scripts/content.js'],
				});
				console.debug(`Injected content script into tab ${tabId}`);
			} catch (error) {
				console.debug(`Failed to inject into tab ${tabId}:`, error);
			}
		}

		async function checkAndInjectIfNeeded(tabId?: number) {
			if (!tabId) return;

			try {
				await browser.tabs.sendMessage<Message>(tabId, {
					type: 'ping',
					content: {},
				});
				console.debug(`Content script already active in tab ${tabId}`);
			} catch (error) {
				console.debug(`No response from content script in tab ${tabId} — injecting...`, error);
				await injectContentScript(tabId);
			}
		}

		async function ensureContentScriptInTabs() {
			const tabs = await browser.tabs.query({});
			await Promise.all(tabs.map(tab => checkAndInjectIfNeeded(tab.id)));
		}

		browser.runtime.onInstalled.addListener(async details => {
			switch (details.reason) {
				case browser.runtime.OnInstalledReason.INSTALL:
					await browser.tabs.create({ url: INSTALL_URL });
					await ensureContentScriptInTabs();
					break;
				case browser.runtime.OnInstalledReason.UPDATE:
					await ensureContentScriptInTabs();
					break;
			}
			await browser.runtime.setUninstallURL(getUninstallUrl());
		});
	},
});
