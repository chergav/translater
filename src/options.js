import { Storage } from './common/storage.js';
import { settings } from './common/settings.js';

(async () => {
	const selectTargetLang = document.querySelector('#select_target_lang');
	const selectTheme = document.querySelector('#select_theme');
	const html = document.documentElement;
	const { themes, languages } = settings;
	let targetLang, theme;
	
	const getSettings = async () => {
		({ targetLang, theme } = await Storage.get());
		html.className = theme;
	};

	const createOptions = (selected, obj) => {
		let options = '';
		for (const i in obj) {
			options += `
				<option value="${i}" ${i === selected ? 'selected' : ''}>${obj[i]}</option>
			`;
		}
		return options;
	};

	const saveSettings = () => 
		Storage.set({ 
			targetLang: selectTargetLang.value,
			theme: selectTheme.value
		});

	await getSettings();

	chrome.storage.onChanged.addListener(getSettings);

	document.querySelectorAll('[data-locale]').forEach(i => 
		i.textContent = chrome.i18n.getMessage(i.dataset.locale)
	);

	selectTargetLang.innerHTML = createOptions(targetLang, languages);
	selectTheme.innerHTML = createOptions(theme, themes);

	selectTargetLang.addEventListener('input', saveSettings);
	selectTheme.addEventListener('input', saveSettings);
})();
