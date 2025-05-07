import type { Settings } from '~/shared/types';

export async function storageGet(keys: Settings | null = null) {
	return await browser.storage.local.get(keys) as Settings;
}

export async function storageSet(data: Partial<Settings>) {
	await browser.storage.local.set(data);
}

export function storageListener(callback: (changes: { [index: string]: Browser.storage.StorageChange }) => void) {
	browser.storage.onChanged.addListener(changes => {
		callback(changes);
	});
}

export async function getShortcutByCommand(command: string) {
	const allCommands = await browser.commands.getAll();
	const findedCommand = allCommands.find(i => i.name === command);
	return findedCommand
		? findedCommand.shortcut?.split(/\s*\+\s*/).filter(Boolean)
		: undefined;
}

export async function detectLanguage(text: string) {
	const result = await browser.i18n.detectLanguage(text);

	if (result.isReliable) {
		const sorted = result.languages.sort((a, b) => b.percentage - a.percentage);
		return sorted[0].language;
	}

	return null;
}
