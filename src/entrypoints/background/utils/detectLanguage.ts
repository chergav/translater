export async function detectLanguage(text: string): Promise<string> {
	const result = await browser.i18n.detectLanguage(text);

	return result.languages.length ? result.languages[0].language : 'en';
}
