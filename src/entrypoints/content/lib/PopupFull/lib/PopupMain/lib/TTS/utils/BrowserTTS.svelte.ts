import type { TTS, BrowserSpeakOptions } from './tts';
import { store } from '~/entrypoints/content/store.svelte';

export class BrowserTTS implements TTS {
	#synth = window.speechSynthesis;
	#utterance: SpeechSynthesisUtterance | null = null;
	status = $state({
		waiting: false,
		speaking: false,
		error: false,
	});

	#stopAllTTS() {
		if (store.audioContextSource) {
			store.audioContextSource.stop();
		}

		if (this.#synth.speaking) {
			this.stop();
		}
	}

	speak({ text = 'sample text-to-speech text', voice = null }: BrowserSpeakOptions) {
		this.status.waiting = true;

		this.#stopAllTTS();
		this.#utterance = new SpeechSynthesisUtterance(text);
		this.#utterance.voice = voice;

		this.#utterance.onstart = () => {
			this.status.waiting = false;
			this.status.speaking = true;
		};

		this.#utterance.onend = () => {
			this.status.speaking = false;
		};

		this.#utterance.onerror = ({ error }) => {
			if (!['canceled', 'interrupted'].includes(error)) {
				console.error(`An error has occurred with the speech synthesis: ${error}`);
			}

			this.status.waiting = false;
			this.status.speaking = false;
		};

		this.#synth.speak(this.#utterance);
	}

	stop() {
		this.#synth.cancel();
	}
}
