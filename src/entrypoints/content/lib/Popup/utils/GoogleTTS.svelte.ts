import type { TTS, GoogleSpeakOptions } from './tts';
import type { GoogleTTSResponse } from '~/shared/types';
import { store } from '~/entrypoints/content/store.svelte';

export class GoogleTTS implements TTS {
	#source: AudioBufferSourceNode | null = null;
	status = $state({
		waiting: false,
		speaking: false,
		error: false,
	});

	async #fetchTTS({ lang, text }: {
		lang: string,
		text: string
	}) {
		try {
			const response: GoogleTTSResponse = await browser.runtime.sendMessage({
				type: 'getTranslateTTS',
				content: {
					lang,
					text,
				},
			});

			return response;
		} catch (error) {
			console.error('Error occurred while fetching TTS: ', error);
		}
	}

	async #play(data: number[]) {
		this.status.waiting = false;
		this.status.speaking = true;

		const u8aBuffer = new Uint8Array(data).buffer;
		const context = new AudioContext();
		const buffer = await context.decodeAudioData(u8aBuffer);
		this.#source = context.createBufferSource();
		this.#source.buffer = buffer;
		this.#source.connect(context.destination);
		this.#source.start();
		this.#source.onended = () => {
			this.status.speaking = false;
		};
		store.audioContextSource = this.#source;
	}

	#stopAllTTS() {
		if (window.speechSynthesis.speaking) {
			window.speechSynthesis.cancel();
		}

		if (store.audioContextSource) {
			store.audioContextSource.stop();
		}
	}

	async speak({ text = '', lang = 'en' }: GoogleSpeakOptions) {
		this.status.waiting = true;

		this.#stopAllTTS();

		const cached = store.cacheTTS.find(i => i.lang === lang && i.text === text);

		if (cached) {
			this.#play(cached.data);
			return;
		}

		const tts = await this.#fetchTTS({
			lang,
			text,
		});

		if (tts && tts.status && tts.data) {
			this.#play(tts.data);
			store.cacheTTS.push({
				lang,
				text,
				data: tts.data,
			});
		} else {
			this.status.waiting = false;
			this.status.error = true;
		}
	}

	stop() {
		if (this.#source) {
			this.#source.stop();
		}
	}
}
