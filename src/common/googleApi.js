const generateRequestURL = ({ sourceLang = 'auto', targetLang = 'auto', selectedText = '' } = {}) => {
	// https://stackoverflow.com/questions/26714426/what-is-the-meaning-of-google-translate-query-params
	const queryParams = {
		client: 'gtx',
		sl: sourceLang,
		tl: targetLang,
		hl: targetLang,
		ie: 'UTF-8',
		oe: 'UTF-8',
		otf: '1',
		ssel: '0',
		tsel: '0',
		kc: '7',
		dj: '1',
		q: selectedText
	};

	const searchParams = new URLSearchParams(queryParams);

	['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'].forEach(i => searchParams.append('dt', i));

	return `https://translate.google.com/translate_a/single?${searchParams}`;
};

const googleTranslate = async params => {
	const url = generateRequestURL(params);

	try {
		const data = await fetch(url);
		return data.json();
	} catch (error) {
		console.error(`Google Translate api error: ${error}`);
	}
};

export { googleTranslate };
