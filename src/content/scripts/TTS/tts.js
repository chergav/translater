import BrowserTTS from './BrowserTTS';
import GoogleTTS from './GoogleTTS';

const getTTS = async lang => {
	const browserTTS = new BrowserTTS();
	const googleTTS = new GoogleTTS();
	const isBrowserTTSAvailable = await browserTTS.isLangAvailable(lang);

	if (isBrowserTTSAvailable) {
		return browserTTS;
	}

	return googleTTS;
};

export default getTTS;
