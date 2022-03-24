import storage from './common/storage.js';
import settings from './common/settings.js';

(async () => {	
	const selectTargetLang = document.querySelector('#select_target_lang');
	const selectTheme = document.querySelector('#select_theme');
	const html = document.documentElement;
	const { themes, languages } = settings;
	const options = document.querySelector('#options');
	options.addEventListener('click', () => chrome.runtime.openOptionsPage());
	document
		.querySelectorAll('[data-locale]')
		.forEach(i => (i.textContent = chrome.i18n.getMessage(i.dataset.locale)));

	let targetLang, theme;

	const getSettings = async () => {
		({ targetLang, theme } = await storage.get('settings'));
		html.className = theme;
	};

	const createOptions = (selected, object) => {
		let options = '';
		for (const key in object) {
			options += `
				<option value="${key}" ${key === selected ? 'selected' : ''}>
					${object[key]}
				</option>
			`;
		}
		return options;
	};

	const saveSettings = () =>
		storage.set({
			settings: {
				targetLang: selectTargetLang.value,
				theme: selectTheme.value,
			},
		});

	await getSettings();

	chrome.storage.onChanged.addListener(getSettings);

	selectTargetLang.innerHTML = createOptions(targetLang, languages);
	selectTheme.innerHTML = createOptions(theme, themes);

	selectTargetLang.addEventListener('input', saveSettings);
	selectTheme.addEventListener('input', saveSettings);
})();
