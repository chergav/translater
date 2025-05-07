import { type Settings, Theme, FontSize } from '~/shared/types';
import { storageGet, storageSet } from '~/shared/browser';
import { isPreferredDark } from '~/utils';
import deepEqual from 'fast-deep-equal';

const initialSettings: Settings = {
	theme: Theme.System,
	fontSize: FontSize.Normal,
	targetLang: browser.i18n.getUILanguage(),
	inlineButtonShow: true,
	textFieldButtonShow: true,
	showOriginalText: true,
	showTransliteration: true,
	blacklistDomainForInline: [],
	blacklistDomainForText: [],
	historyEnable: true,
	historyLength: 50,
	history: [],
	lockWindow: false,
	ttsVoiceByLang: {},
};

class Storage {
	#cleanup: () => void;
	public settings = $state<Settings>(initialSettings);
	public themeClass = $derived.by(() => {
		if (this.settings.theme === Theme.System) {
			return isPreferredDark() ? Theme.Dark : Theme.Light;
		}
		return this.settings.theme;
	});

	public constructor(settings: Settings) {
		this.settings = settings;
		this.#cleanup = $effect.root(() => {
			$effect(() => {
				const stateSnapshot = $state.snapshot(this.settings);
				this.#sync(stateSnapshot);
			});
		});
		browser.storage.onChanged.addListener(this.#onStorageChange);
	}

	async #sync(snapshot: Settings) {
		const external = await storageGet();

		if (!deepEqual(external, snapshot)) {
			browser.storage.onChanged.removeListener(this.#onStorageChange);
			await storageSet(snapshot);
			browser.storage.onChanged.addListener(this.#onStorageChange);
		}
	}

	// arrow func to bind this class
	#onStorageChange = (changes: { [key: string]: Browser.storage.StorageChange }) => {
		const stateSnapshot = $state.snapshot(this.settings);

		for (const [keyString, {  newValue }] of Object.entries(changes)) {
			const key = keyString as keyof Settings;
			if (!deepEqual(stateSnapshot[key], newValue)) {
				Object.assign(this.settings, { [key]: newValue });
			}
		}
	};

	public destroy() {
		this.#cleanup();
		browser.storage.onChanged.removeListener(this.#onStorageChange);
	}
}

const settings = await storageGet(initialSettings);

export const storage = new Storage(settings);
