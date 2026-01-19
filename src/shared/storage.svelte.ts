import { type Settings, Theme, ThemeVariant, AccentColor, FontSize } from '~/types';
import { GOOGLE_TRANSLATE_MODEL_ID } from '~/types/providers';
import { MediaQuery } from 'svelte/reactivity';
import { storageGet, storageSet } from '~/shared/browser';
// import { isPreferredDark } from '~/utils';
import deepEqual from 'fast-deep-equal';

const initialSettings: Settings = {
	theme: Theme.System,
	themeVariant: ThemeVariant.Slate,
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
	modelId: GOOGLE_TRANSLATE_MODEL_ID,
};

class Storage {
	#cleanup: () => void;
	#isPreferredDark = new MediaQuery('prefers-color-scheme: dark');
	#isWriting = false;
	public settings: Settings;
	public themeClass: Theme.Light | Theme.Dark;

	public constructor(settings: Settings) {
		this.settings = $state<Settings>(settings);
		this.themeClass = $derived(this.#getThemeClass(this.settings.theme));
		this.#cleanup = $effect.root(() => {
			$effect(() => {
				if (this.#isWriting) return;

				const stateSnapshot = $state.snapshot(this.settings);
				this.#sync(stateSnapshot);
			});
		});
		browser.storage.local.onChanged.addListener(this.#onStorageChange);
	}

	#getThemeClass(theme: Theme) {
		if (theme === Theme.System) {
			return this.#isPreferredDark.current ? Theme.Dark : Theme.Light;
		}
		return theme;
	}

	async #sync(snapshot: Settings) {
		const external = await storageGet();

		if (!deepEqual(external, snapshot)) {
			this.#isWriting = true;
			await storageSet(snapshot);
			this.#isWriting = false;
		}
	}

	// arrow func to bind this class
	#onStorageChange = (changes: { [key: string]: Browser.storage.StorageChange }) => {
		this.#isWriting = true;
		const stateSnapshot = $state.snapshot(this.settings);

		for (const [keyString, {  newValue }] of Object.entries(changes)) {
			const key = keyString as keyof Settings;
			if (!deepEqual(stateSnapshot[key], newValue)) {
				Object.assign(this.settings, { [key]: newValue });
			}
		}

		this.#isWriting = false;
	};

	public destroy() {
		this.#cleanup();
		browser.storage.local.onChanged.removeListener(this.#onStorageChange);
	}
}

const settings = await storageGet(initialSettings);

export const storage = new Storage(settings);
