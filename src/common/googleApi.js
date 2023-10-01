const googleTranslateURL = ({ sourceLang = 'auto', targetLang = 'auto', selectedText = '' } = {}) => {
	// https://stackoverflow.com/questions/26714426/what-is-the-meaning-of-google-translate-query-params
	const searchParams = new URLSearchParams({
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
	});

	['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'].forEach(i =>
		searchParams.append('dt', i)
	);

	// return `https://translate.google.com/translate_a/single?${searchParams}`;
	return `https://translate.googleapis.com/translate_a/single?${searchParams}`;
};

const googleTranslate = async params => {
	const url = googleTranslateURL(params);

	try {
		const data = await fetch(url);
		return data.json();
	} catch (error) {
		console.error(`Google Translate api error: ${error}`);
	}
};

const googleTTSURL = ({ lang = 'en', text = '' } = {}) => {
	const searchParams = new URLSearchParams({
		// client: 'tw-ob',
		client: 'gtx',
		// ttsspeed: '0.8',
		ie: 'UTF-8',
		tl: lang,
		q: text.substring(0, 200) // text <= 200 character limit
	});

	return `https://translate.googleapis.com/translate_tts?${searchParams}`;
};

const googleTTS = async params => {
	const url = googleTTSURL(params);
	// console.log(params, url);

	try {
		const response = await fetch(url);

		if (response.ok) {
			const ab = await response.arrayBuffer();
			const array = Array.from(new Uint8Array(ab));
			// console.log(array);
			return { status: true, data: array };
		} else {
			return { status: false };
		}
	} catch (error) {
		console.error(`Google Translate TTS api error: ${error}`);
	}
};

export { googleTranslate, googleTTS };
