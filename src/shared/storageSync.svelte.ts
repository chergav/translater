import { type SettingsSync } from '~/types';
import deepEqual from 'fast-deep-equal';

const initialSettings: SettingsSync = {
	customProviders: [],
};

class StorageSync {
	#cleanup: () => void;
	public settings: SettingsSync;

	public constructor(settings: SettingsSync) {
		this.settings = $state<SettingsSync>(settings);
		this.#cleanup = $effect.root(() => {
			$effect(() => {
				const stateSnapshot = $state.snapshot(this.settings);
				this.#sync(stateSnapshot);
			});
		});
		browser.storage.onChanged.addListener(this.#onStorageChange);
	}

	async #sync(snapshot: SettingsSync) {
		const external = await browser.storage.sync.get<SettingsSync>();

		if (!deepEqual(external, snapshot)) {
			browser.storage.onChanged.removeListener(this.#onStorageChange);
			await browser.storage.sync.set<SettingsSync>(snapshot);
			browser.storage.onChanged.addListener(this.#onStorageChange);
		}
	}

	// arrow func to bind this class
	#onStorageChange = (
		changes: { [key: string]: Browser.storage.StorageChange },
		areaName: Browser.storage.AreaName,
	) => {
		if (areaName !== 'sync') return;

		const stateSnapshot = $state.snapshot(this.settings);

		for (const [keyString, { newValue }] of Object.entries(changes)) {
			const key = keyString as keyof SettingsSync;
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

const settings = await browser.storage.sync.get<SettingsSync>(initialSettings);

export const storageSync = new StorageSync(settings);
