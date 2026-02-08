import type { Language } from '~/types';

export function getTargetLanguage(availableLanguages: Language[]): string {
	const browserLang = browser.i18n.getUILanguage();

	const normalizedBrowserLang = browserLang.toLowerCase();

	const exactMatch = availableLanguages.find(
		lang => lang.code.toLowerCase() === normalizedBrowserLang,
	);
	if (exactMatch) return exactMatch.code;

	const baseLang = normalizedBrowserLang.split('-')[0];
	const baseOrRegionalMatch = availableLanguages.find(
		lang => {
			const langCode = lang.code.toLowerCase();
			return langCode === baseLang || langCode.startsWith(baseLang + '-');
		},
	);
	if (baseOrRegionalMatch) return baseOrRegionalMatch.code;

	const englishFallback = availableLanguages.find(
		lang => {
			const langCode = lang.code.toLowerCase();
			return langCode === 'en' || langCode.startsWith('en-');
		},
	);
	if (englishFallback) return englishFallback.code;

	return availableLanguages[0]?.code || 'en';
}
