import { type Settings, Theme, ThemeVariant, AccentColor, FontSize } from '~/shared/types';
import { storageGet, storageSet } from '~/shared/browser';
import { isPreferredDark } from '~/utils';
import deepEqual from 'fast-deep-equal';

const initialSettings: Settings = {
	theme: Theme.System,
	themeVariant: ThemeVariant.Gray,
	accentColor: AccentColor.Blue,
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
	public settings: Settings;
	public themeClass: Theme.Light | Theme.Dark;

	public constructor(settings: Settings) {
		this.settings = $state<Settings>(settings);
		this.themeClass = $derived(this.#getThemeClass(this.settings.theme));
		this.#cleanup = $effect.root(() => {
			$effect(() => {
				const stateSnapshot = $state.snapshot(this.settings);
				this.#sync(stateSnapshot);
			});
		});
		browser.storage.onChanged.addListener(this.#onStorageChange);
	}

	#getThemeClass(theme: Theme) {
		if (theme === Theme.System) {
			return isPreferredDark() ? Theme.Dark : Theme.Light;
		}
		return theme;
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
