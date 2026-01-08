import type { GoogleTTSResponse } from '~/types';
import type { GoogleTranslate } from '~/types/google';
// import { mock } from './mock';

export interface TranslateProps {
	sourceLang?: string
	targetLang?: string
	text?: string
}

const googleTranslateURL = ({ sourceLang = 'auto', targetLang = 'auto', text = '' }: TranslateProps) => {
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

export const googleTranslate = async (params: TranslateProps): Promise<GoogleTranslate> => {
	// if (import.meta.env.DEV) {
	// 	return new Promise(r => {
	// 		setTimeout(() => {
	// 			r(mock as GoogleTranslate);
	// 		}, 1000);
	// 	});
	// }

	const url = googleTranslateURL(params);

	try {
		const response = await fetch(url, {
			signal: AbortSignal.timeout(5000),
		});

		if (!response.ok) {
			throw new Error(`${response.status} ${response.statusText}`);
		}

		return response.json();
	} catch (error) {
		const msg = `Google Translate API error: ${error}`;
		console.debug(msg);
		throw new Error(msg);
	}
};

const googleTTSURL = ({ targetLang = 'en', text = '' }: TranslateProps): string => {
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

export const googleTTS = async (param: TranslateProps): Promise<GoogleTTSResponse> => {
	const url = googleTTSURL(param);

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
