import { defaultSettings } from '~/common/settings';

const getUILanguage = () => chrome.i18n.getUILanguage();

const detectLanguage = async text => {
	const result = await chrome.i18n.detectLanguage(text);
	return result.isReliable ? result.languages[0].language : null;
};

const storageGet = async () => await chrome.storage.local.get(defaultSettings);

const storageSet = async data => {
	await chrome.storage.local.set(data);
};

const storageListener = callback => {
	chrome.storage.onChanged.addListener(changes => {
		callback(changes);
	});
};

const getMessage = msg => {
	try {
		return chrome.i18n.getMessage(msg);
	} catch {
		// no console error
	}
};

const getURL = path => chrome.runtime.getURL(path);

const openOptionsPage = () => {
	chrome.runtime.openOptionsPage();
};

const sendMessage = msg => {
	chrome.runtime.sendMessage(msg);
};

const isChrome = () => !chrome.runtime.getManifest().browser_specific_settings;

const getShortcutByCommand = async command => {
	const allCommands = await chrome.commands.getAll();
	const findedCommand = allCommands.find(i => i.name === command);
	return findedCommand
		? findedCommand.shortcut.split(/\s*\+\s*/).filter(Boolean)
		: null;
};

const tabCreate = createProperties => {
	chrome.tabs.create(createProperties);
};

export {
	getUILanguage,
	detectLanguage,
	storageGet,
	storageSet,
	storageListener,
	getMessage,
	getURL,
	openOptionsPage,
	isChrome,
	sendMessage,
	getShortcutByCommand,
	tabCreate
};
