import { type Settings, Theme, ThemeVariant, AccentColor, FontSize, PopupMode } from '~/types';
import { GOOGLE_TRANSLATE_MODEL_ID } from '~/types/providers';
import { MediaQuery } from 'svelte/reactivity';
import { getUILanguageCode } from '~/shared/languages';
import deepEqual from 'fast-deep-equal';

const initialSettings: Settings = {
	theme: Theme.System,
	themeVariant: ThemeVariant.Slate,
	accentColor: AccentColor.Blue,
	fontSize: FontSize.Normal,
	sourceLang: 'auto',
	targetLang: getUILanguageCode(),
	inlineButtonShow: true,
	textFieldButtonShow: true,
	showOriginalText: true,
	showTransliteration: true,
	blacklistDomainForInline: [],
	blacklistDomainForText: [],
	historyEnable: true,
	historyLength: 50,
	lockWindow: false,
	ttsVoiceByLang: {},
	modelId: GOOGLE_TRANSLATE_MODEL_ID,
	hideButtonForUserLanguage: false,
	showPopupOnSelection: false,
	popupMode: PopupMode.Full,
};

class Storage {
	#cleanup: () => void;
	#isPreferredDark = new MediaQuery('prefers-color-scheme: dark');
	#lastExternalSnapshot: Partial<Settings> = {};
	#prevSnapshot: Settings;
	public settings: Settings;
	public themeClass: Theme.Light | Theme.Dark;

	public constructor(settings: Settings) {
		this.settings = $state<Settings>(settings);
		this.#prevSnapshot = settings;
		this.themeClass = $derived(this.#getThemeClass(this.settings.theme));
		this.#cleanup = $effect.root(() => {
			$effect(() => {
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
		for (const key of Object.keys(snapshot) as (keyof Settings)[]) {
			// Skip keys that came from external storage
			if (deepEqual(this.#lastExternalSnapshot[key], snapshot[key])) continue;

			// Write only keys that changed from previous local snapshot
			if (deepEqual(this.#prevSnapshot[key], snapshot[key])) continue;

			// console.log('#sync', { [key]: snapshot[key] });
			await browser.storage.local.set({ [key]: snapshot[key] });
		}

		// console.debug($state.snapshot(this.settings));
		this.#prevSnapshot = snapshot;
	}

	// arrow func to bind this class
	#onStorageChange = (changes: { [key: string]: Browser.storage.StorageChange }) => {
		const stateSnapshot = $state.snapshot(this.settings);

		for (const [keyString, {  newValue }] of Object.entries(changes)) {
			const key = keyString as keyof Settings;

			if (!(key in initialSettings)) continue;

			if (!deepEqual(stateSnapshot[key], newValue)) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				this.#lastExternalSnapshot[key] = newValue as any;
				Object.assign(this.settings, { [key]: newValue });
			}
		}
	};

	public destroy() {
		this.#cleanup();
		browser.storage.local.onChanged.removeListener(this.#onStorageChange);
	}
}

const settings = await browser.storage.local.get<Settings>(initialSettings);

export const storage = new Storage(settings);
