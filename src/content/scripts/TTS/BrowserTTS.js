import { writable, get } from 'svelte/store';
import { store } from '~/content/store';

class BrowserTTS {
	#synth = window.speechSynthesis;
	#voices = null;
	#speech = null;
	status = writable({
		waiting: false,
		speaking: false,
		error: false
	});

	#setVoices(voices) {
		this.#voices = voices;
		store.update(data => ({
			...data,
			voices
		}));
	}

	#getVoices() {
		const { voices } = get(store);

		if (voices) {
			this.#voices = voices;
			return;
		}

		return new Promise(resolve => {
			let voices = this.#synth.getVoices();
			if (voices.length > 0) {
				this.#setVoices(voices);
				resolve(true);
			} else {
				const interval = setInterval(() => {
					voices = this.#synth.getVoices();
					if (voices.length > 0) {
						clearInterval(interval);
						this.#setVoices(voices);
						resolve(true);
					}
				}, 100);

				setTimeout(() => {
					if (voices.length === 0) {
						clearInterval(interval);
						resolve(false);
					}
				}, 1000);
			}
		});
	}

	async isLangAvailable(lang) {
		await this.#getVoices();
		return this.#voices ? this.#voices.find(v => v.lang.startsWith(lang)) : false;
	}

	#setLang(lang) {
		const voice = this.#voices.find(v => v.lang.startsWith(lang));
		if (!voice) {
			throw new Error(`Language ${lang} is not supported.`);
		}
		this.#speech.lang = voice.lang;
	}

	stop() {
		this.#synth.cancel();
	}

	#stopAllTTS() {
		const { audioContextSource } = get(store);

		if (this.#synth.speaking) {
			this.stop();
		}

		if (audioContextSource) {
			audioContextSource.stop();
		}
	}

	speak(text = '', lang = 'en') {
		this.status.update(data => ({
			...data,
			waiting: true
		}));

		this.#stopAllTTS();

		this.#speech = new SpeechSynthesisUtterance(text);

		this.#setLang(lang);

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
