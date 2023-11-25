import { writable, get } from 'svelte/store';
import { store } from '~/content/store';

class BrowserTTS {
	#synth = window.speechSynthesis;
	#speech = null;
	status = writable({
		waiting: false,
		speaking: false,
		error: false
	});

	stop() {
		this.#synth.cancel();
	}

	#stopAllTTS() {
		const { audioContextSource } = get(store);

		if (audioContextSource) {
			audioContextSource.stop();
		}

		if (this.#synth.speaking) {
			this.stop();
		}

	}

	speak({ text = 'sample text-to-speech text', voice = null }) {
		this.status.update(data => ({
			...data,
			waiting: true
		}));

		this.#stopAllTTS();
		this.#speech = new SpeechSynthesisUtterance(text);
		this.#speech.voice = voice;

		this.#speech.onstart = () => {
			this.status.update(data => ({
				...data,
				waiting: false,
				speaking: true
			}));
		};

		this.#speech.onend = () => {
			this.status.update(data => ({
				...data,
				speaking: false
			}));
		};

		this.#speech.onerror = ({ error }) => {
			if (!['canceled', 'interrupted'].includes(error)) {
				console.error(`An error has occurred with the speech synthesis: ${error}`);
			}

			this.status.update(data => ({
				...data,
				waiting: false,
				speaking: false
			}));
		};

		this.#synth.speak(this.#speech);
	}
}

export default BrowserTTS;
