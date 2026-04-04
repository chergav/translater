import type { GoogleTTSResponse } from '~/types';
import type { Translated, GoogleTranslate, Sentence } from '~/types/google';
import { setCache, getCache } from '~/entrypoints/background/utils/cache';

export interface TranslateProps {
	text: string
	sourceLang: string
	targetLang: string
}

export interface TTSProps {
	text: string
	targetLang: string
}

const provider = 'google-translate/google-translate';

const buildSentence = (resp: GoogleTranslate): Sentence => {
	const keys: Array<keyof Sentence> = [
		'orig',
		'trans',
		'translit',
		'src_translit',
	];
	const sentence = keys.reduce((acc, key) => {
		const str = resp.sentences
			.map(s => s[key] || '')
			.join('');
		return {
			...acc,
			[key]: str,
		};
	}, {} as Sentence);

	return sentence;
};

const googleTranslateURL = ({ text, sourceLang, targetLang }: TranslateProps) => {
	// https://stackoverflow.com/questions/26714426/what-is-the-meaning-of-google-translate-query-params
	const searchParams = new URLSearchParams({
		client: 'gtx',
		// client: 'dict-chrome-ex',
		sl: sourceLang,
		tl: targetLang,
		hl: browser.i18n.getUILanguage(),
		ie: 'UTF-8',
		oe: 'UTF-8',
		otf: '1',
		ssel: '0',
		tsel: '0',
		kc: '7',
		dj: '1',
		q: text,
		model: 'nmt',
	});

	['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 'sw', 't', 'sd'].forEach(i =>
		searchParams.append('dt', i),
	);

	// return `https://translate.google.com/translate_a/single?${searchParams}`;
	return `https://translate.googleapis.com/translate_a/single?${searchParams}`;
};

export const googleTranslate = async ({
	text = '',
	sourceLang = 'auto',
	targetLang = browser.i18n.getUILanguage(),
}: TranslateProps): Promise<Translated> => {
	const cached = await getCache<Translated>(text, sourceLang, targetLang, provider);

	if (cached) return cached;

	const url = googleTranslateURL({
		text,
		sourceLang,
		targetLang,
	});

	try {
		const response = await fetch(url, {
			signal: AbortSignal.timeout(5000),
		});

		if (!response.ok) {
			throw new Error(`${response.status} ${response.statusText}`);
		}

		const result = await response.json() as GoogleTranslate;

		const sentence = buildSentence(result);
		const translated: Translated = {
			...result,
			sentence,
			sourceLang: result.src,
			targetLang,
		};

		const cacheKey = await setCache(text, sourceLang, targetLang, provider, translated);

		return {
			...translated,
			cacheKey,
		};
	} catch (error) {
		const msg = `[Google Translate API]: ${error}.
If you use a VPN/Proxy, disable it or add the host "https://translate.googleapis.com" to the exceptions of your VPN/Proxy application.
Or try another provider.`;
		console.debug(msg);
		throw new Error(msg);
	}
};

const googleTTSURL = ({ text , targetLang }: TTSProps): string => {
	const searchParams = new URLSearchParams({
		// client: 'tw-ob',
		client: 'gtx',
		ttsspeed: '0.8',
		ie: 'UTF-8',
		tl: targetLang,
		q: text.substring(0, 200), // text <= 200 character limit
	});

	return `https://translate.googleapis.com/translate_tts?${searchParams}`;
};

export const googleTTS = async ({ text = '', targetLang = 'en' }: TTSProps): Promise<GoogleTTSResponse> => {
	const url = googleTTSURL({
		text,
		targetLang,
	});

	try {
		const response = await fetch(url, {
			signal: AbortSignal.timeout(5000),
		});

		if (response.ok) {
			const ab = await response.arrayBuffer();
			const array = Array.from(new Uint8Array(ab));
			return {
				status: true,
				data: array,
			};
		}
	} catch (error) {
		console.error(`Google TTS api error: ${error}`);
	}

	return { status: false };
};

export const createLinkToGT = ({ sl = 'auto', tl = 'auto', text = '' }) => {
	const searchParams = new URLSearchParams({
		sl,
		tl,
		text,
	});
	return `https://translate.google.com/?${searchParams}`;
};
