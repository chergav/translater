const getGoogleTranslate = async ({ sourceLang = 'auto', targetLang = 'auto', selectedText = '' } = {}) => {
	const base = 'https://translate.googleapis.com/translate_a/single';
	// https://stackoverflow.com/questions/26714426/what-is-the-meaning-of-google-translate-query-params
	const params = '?client=gtx&dt=t&dt=bd&dt=md&dt=ex&dt=ss&dj=1';
	const langs = `&sl=${sourceLang}&tl=${targetLang}`;
	const query = `&q=${encodeURIComponent(selectedText)}`;

	const url = base + params + langs + query;

	try {
		const data = await fetch(url);
		return data.json();
	} catch (error) {
		console.error(`Google Translate api error: ${error}`);
	}
};

export { getGoogleTranslate };
