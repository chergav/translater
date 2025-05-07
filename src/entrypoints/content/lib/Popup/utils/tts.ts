import { BrowserTTS } from './BrowserTTS.svelte';
import { GoogleTTS } from './GoogleTTS.svelte';

export interface Status {
	waiting: boolean
	speaking: boolean
	error: boolean
}

export interface BrowserSpeakOptions {
	text: string;
	voice?: SpeechSynthesisVoice | null;
}

export interface GoogleSpeakOptions {
	text: string;
	lang: string;
}

export type SpeakOptions = BrowserSpeakOptions | GoogleSpeakOptions;

export interface TTS {
	status: Status
	speak(opts: SpeakOptions): void | Promise<void>;
	stop(): void;
}

export const getVoices = async (): Promise<SpeechSynthesisVoice[]> => {
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

export const getVoicesByLang = (
	lang: string,
	voices: SpeechSynthesisVoice[],
) => voices ? voices.filter(i => i.lang.startsWith(lang)) : [];

export const getTTS = (lang: string, voices: SpeechSynthesisVoice[]) => {
	const isBrowserTTSAvailable = voices.find(v => v.lang.startsWith(lang));

	if (isBrowserTTSAvailable) {
		return new BrowserTTS();
	}

	return new GoogleTTS();
};
