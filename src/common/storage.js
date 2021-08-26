export class Storage {
	static _storage = chrome.storage.sync;

	static _defaultSettings = {
		sourceLang: 'auto',
		targetLang: chrome.i18n.getUILanguage(),
		theme: 'lt'
	};
	
	static async _getStorageData(key = null) {
		return new Promise((res, _) => {
			this._storage.get(key, data =>
				res(data && data[key] ? data[key] : this._defaultSettings)
			);
		});
	}

	static set(data) {
		this._storage.set({ settings: data }, () => 
			// alert(chrome.i18n.getMessage('data_saved'))
			console.log(data)
		);
	}

	static async get() {
		return await this._getStorageData('settings');
	}
}
