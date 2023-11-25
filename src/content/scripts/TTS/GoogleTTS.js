import { writable, get } from 'svelte/store';
import { store } from '~/content/store';

class GoogleTTS {
	#source = null;
	status = writable({
		waiting: false,
		speaking: false,
		error: false
	});

	async #fetchTTS({ lang, text }) {
		try {
			const content = {
				lang,
				text
			};

			const response = await chrome.runtime.sendMessage({
				type: 'getTranslateTTS',
				content
			});

			return response;
		} catch (error) {
			console.error('Error occurred while fetching translation: ', error);
			throw error;
		}
	}

	async #play(data) {
		this.status.update(data => ({
			...data,
			waiting: false,
			speaking: true
		}));
		const u8aBuffer = new Uint8Array(data).buffer;
		const context = new AudioContext();
		const buffer = await context.decodeAudioData(u8aBuffer);
		this.#source = context.createBufferSource();
		this.#source.buffer = buffer;
		this.#source.connect(context.destination);
		this.#source.start();
		this.#source.onended = () => {
			this.status.update(data => ({
				...data,
				speaking: false
			}));
		};
		store.update(data => ({
			...data,
			audioContextSource: this.#source
		}));
	}

	stop() {
		if (this.#source) {
			this.#source.stop();
		}
	}

	#stopAllTTS() {
		const { audioContextSource } = get(store);

		if (window.speechSynthesis.speaking) {
			window.speechSynthesis.cancel();
		}

		if (audioContextSource) {
			audioContextSource.stop();
		}
	}

	async speak({ text = '', lang = 'en' }) {
		this.status.update(data => ({
			...data,
			waiting: true
		}));

		this.#stopAllTTS();

		const { cacheTTS } = get(store);

		const cached = cacheTTS.find(i => i.lang === lang && i.text === text);

		if (cached) {
			this.#play(cached.data);
			return;
		}

		const tts = await this.#fetchTTS({ lang, text });

		if (tts.status) {
			this.#play(tts.data);
			store.update(data => ({
				...data,
				cacheTTS: [...data.cacheTTS, { lang, text, data: tts.data }]
			}));
		} else {
			this.status.update(data => ({
				...data,
				waiting: false,
				error: true
			}));
		}
	}
}

export default GoogleTTS;
