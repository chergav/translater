import BrowserTTS from './BrowserTTS';
import GoogleTTS from './GoogleTTS';

const getVoices = async () => {
	return new Promise(resolve => {
		let voices = speechSynthesis.getVoices();
		if (voices.length > 0) {
			resolve(voices);
		} else {
			const interval = setInterval(() => {
				voices = speechSynthesis.getVoices();
				if (voices.length > 0) {
					clearInterval(interval);
					resolve(voices);
				}
			}, 100);

			setTimeout(() => {
				if (voices.length === 0) {
					clearInterval(interval);
					resolve([]);
				}
			}, 1000);
		}
	});
};

const getVoicesByLang = (lang, voices) => voices ? voices.filter(i => i.lang.startsWith(lang)) : [];

const getTTS = (lang, voices) => {
	const browserTTS = new BrowserTTS();
	const googleTTS = new GoogleTTS();
	const isBrowserTTSAvailable = voices.find(v => v.lang.startsWith(lang));

	if (isBrowserTTSAvailable) {
		return browserTTS;
	}

	return googleTTS;
};

export { getTTS, getVoices, getVoicesByLang };
