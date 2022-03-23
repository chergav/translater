import settings from './settings.js';

class Storage {
	constructor() {
		this.#init();
	}
	
	#storage = chrome.storage.sync;

	#init() {
		this.#storage.get('settings').then(data => {
			if (Object.keys(data).length === 0) {
				this.set({ settings: settings.defaultSettings });
				this.set({ languages: settings.languages });
			}
		});
	};

	async #getStorageData(key) {
		// chrome.storage.sync.clear();
		return this.#storage
			.get(key)
			.then(data => (data && data[key] ? data[key] : false))
			.catch(error => console.log(error));
	}

	set(data) {
		this.#storage.set(data, () =>
			//alert(chrome.i18n.getMessage('data_saved'))
			console.log('storage.set: ', data)
		);
	}

	async get(key = null) {
		return await this.#getStorageData(key);
	}
}

export default new Storage;
