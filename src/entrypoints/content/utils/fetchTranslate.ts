import type { GoogleTranslate } from '~/shared/translate.types';

export async function fetchTranslate(sourceLang: string, targetLang: string, selectedText: string) {
	try {
		const response: GoogleTranslate = await browser.runtime.sendMessage({
			type: 'getTranslate',
			content: {
				sourceLang,
				targetLang,
				selectedText,
			},
		});

		return response;
	} catch (error) {
		console.error('Error occurred while fetching translation: ', error);
	}
}
