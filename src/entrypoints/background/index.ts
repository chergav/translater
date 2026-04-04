import type { Message } from '~/types';
import { googleTranslate, googleTTS } from './providers/google';
import { getCacheByKey } from './utils/cache';
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

		async function openTranslator() {
			const tab = await getCurrentTab();

			if (tab && tab.id) {
				const selectedText = await getSelectedText(tab.id) || '';

				try {
					await browser.tabs.sendMessage<Message>(tab.id, {
						type: 'createPopup',
						content: {
							text: selectedText,
						},
					});
				} catch (error) {
					console.debug('Failed to send message. No content script.', error);
				}
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
					return true;
				case 'getTranslateTTS':
					googleTTS(message.content).then(sendResponse);
					return true;
				case 'openOptionsPage':
					browser.runtime.openOptionsPage();
					break;
				case 'openURL':
					browser.tabs.create({ url: message.content.url });
					break;
				case 'openTranslator':
					openTranslator();
					break;
				case 'pingContentScript':
					ensureContentScriptInActiveTab().then(sendResponse);
					return true;
				case 'getCachedItem':
					getCacheByKey(message.content.cacheKey).then(sendResponse);
					return true;
				default:
					console.error(`Message type "${message.type}" not found.`);
					break;
			}
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

				try {
					await browser.tabs.sendMessage<Message>(tabId, {
						type: 'createPopup',
						content: {
							text: info.selectionText,
						},
					});
				} catch (error) {
					console.debug('Failed to send message. No content script.', error);
				}
			}
		});

		browser.commands.onCommand.addListener(command => {
			switch (command) {
				case 'open-translator':
					openTranslator();
					break;
				default:
					console.error(`Command "${command}" not found.`);
					break;
			}
		});

		browser.runtime.onInstalled.addListener(() => {
			try {
				browser.contextMenus.create({
					id: 'translaterMenu',
					title: browser.i18n.getMessage('context_menus_title'),
					contexts: ['selection'],
				});
			} catch (error) {
				console.debug('Failed create menu.', error);
			}
		});

		async function ensureContentScriptInActiveTab() {
			const tab = await getCurrentTab();
			return await pingContentScript(tab.id);
		}

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

		async function pingContentScript(tabId?: number): Promise<boolean> {
			if (!tabId) return false;

			try {
				await browser.tabs.sendMessage<Message>(tabId, { type: 'ping' });
				console.debug(`Content script exist in tab: ${tabId}`);
				return true;
			} catch (error) {
				console.debug(`No response from content script in tab ${tabId}`, error);
				return false;
			}
		}

		async function checkAndInjectIfNeeded(tabId?: number) {
			if (!tabId) return;

			const isContentScriptExist = await pingContentScript(tabId);

			if (isContentScriptExist) {
				console.debug(`Content script already active in tab ${tabId}`);
			} else {
				console.debug(`No response from content script in tab ${tabId} — injecting...`);
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
