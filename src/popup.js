import { Storage } from './common/storage.js';

(async () => {	
	const options = document.querySelector('#options');
	const html = document.documentElement;
	const { theme } = await Storage.get();

	options.addEventListener('click', () => chrome.runtime.openOptionsPage());

	html.className = theme;
})();
