import settings from './settings.js';

class Storage {
	static #storage = chrome.storage.sync;

	static async #init() {
		this.set({ settings: settings.defaultSettings });
		this.set({ languages: settings.languages });
		return settings.defaultSettings;
	};

	static async #getStorageData(key) {
		// chrome.storage.sync.clear();
		return this.#storage
			.get(key)
			.then(data => (data && data[key] ? data[key] : this.#init()))
			.catch(error => console.log(error));
	}

	static set(data) {
		this.#storage.set(data, () =>
			//alert(chrome.i18n.getMessage('data_saved'))
			console.log('storage.set: ', data)
		);
	}

	static async get(key = null) {
		return await this.#getStorageData(key);
	}
}

export { Storage as default };
