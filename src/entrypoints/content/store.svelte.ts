import type { CacheTTS, TranslationAi, Message, HistoryItem } from '~/types';
import type { GoogleTranslate, Translated, Sentence } from '~/types/google';
import { ProviderId, GOOGLE_TRANSLATE_MODEL_ID } from '~/types/providers';
import { storage } from '~/shared/storage.svelte';
import { providerStore } from '~/entrypoints/options/lib/Providers/providerStore.svelte';
import { translator } from './utils/TranslationClient';

class Store {
	public errors = $state<string[]>([]);
	public hostname = $state<string>('');
	public sourceLang = $state<string>('auto');
	public selectedText = $state<string>('');
	public textToTranslate = $state<string>('');
	public showPopup = $state<boolean>(false);
	public selectedElemRect = $state<DOMRect | null>(null);
	public selectedEndCoord = $state<DOMRect | null>(null);
	public isInTextField = $state<boolean>(false);
	public translated = $state<Translated | null>(null);
	public translationAi = $state<TranslationAi | null>(null);
	public cache = $state<Translated[]>([]);
	public cacheIndex = $state<number>(-1);
	public isPending = $state<boolean>(false);
	public audioContextSource = $state<AudioBufferSourceNode | null>(null);
	public cacheTTS = $state<CacheTTS[]>([]);
	public textToHighlight = $state<string>('');
	public downloadProgress = $state<number | null>(null);

	public async translate() {
		const textToTranslate = this.textToTranslate.trim();
		if (!textToTranslate) return;

		this.translated = null;
		this.translationAi = null;
		this.errors = [];

		const useAi = storage.settings.modelId !== GOOGLE_TRANSLATE_MODEL_ID;

		const [googleResult, aiResult] = await Promise.all([
			this.translateGoogle(textToTranslate),
			useAi ? this.translateAi(textToTranslate) : Promise.resolve(null),
		]);

		if (!useAi && !googleResult) {
			this.errors.push('Google Translate service error');
			return;
		}

		if (useAi && !aiResult) return;

		const finalTranslatedText = useAi && aiResult
			? aiResult
			: googleResult?.sentence.trans || '';

		this.addToHistory(textToTranslate, finalTranslatedText);
		if (googleResult) this.addToCache(googleResult, finalTranslatedText);
	}

	public stopTranslation() {
		translator.cancelTranslation();
	}

	public resetTranslateStore() {
		this.selectedText = '';
		this.textToTranslate = '';
		this.sourceLang = 'auto';
		this.translated = null;
		this.translationAi = null;
		this.errors = [];
	}

	private async translateAi(text: string): Promise<string | null> {
		const sourceLang = this.sourceLang !== 'auto' ?  this.sourceLang : undefined;
		const targetLang = storage.settings.targetLang;
		const modelId = storage.settings.modelId;

		return new Promise<string | null>(resolve => {
			translator.translateText(
				text,
				targetLang,
				modelId,
				{
					onStart: () => {
						this.translationAi = {
							text: '',
							isStreaming: true,
						};
					},
					onDownloadProgress: percent => {
						const percentDisplay = Math.round(percent * 100);
						this.downloadProgress = percentDisplay;
					},
					onChunk: (chunk, sourceLang) => {
						if (this.translationAi) {
							this.downloadProgress = null;
							this.translationAi.text += chunk;
						}
						if (sourceLang) {
							this.sourceLang = sourceLang;
						}
					},
					onComplete: (finalText, sourceLang) => {
						if (this.translationAi) {
							this.translationAi.text = finalText;
							this.translationAi.isStreaming = false;
						}
						if (sourceLang) {
							this.sourceLang = sourceLang;
						}
						resolve(finalText);
					},
					onError: error => {
						console.log('Translation error:', error);
						this.errors.push(error);
						if (this.translationAi) {
							this.translationAi.isStreaming = false;
						}
						resolve(null);
					},
					onCancel: () => {
						console.log('Translation canceled');
						if (this.translationAi) {
							this.translationAi.isStreaming = false;
						}
						resolve(null);
					},
				},
				sourceLang,
			);
		});
	}

	private async translateGoogle(text: string): Promise<Translated | null> {
		this.isPending = true;

		const sourceLang = this.sourceLang;
		const targetLang = storage.settings.targetLang;
		const model = `${providerStore.selectedProvider.id}/${providerStore.selectedModel.id}`;

		const fromCache = this.findInCache(
			text,
			sourceLang,
			targetLang,
			`${ProviderId.GoogleTranslate}/${GOOGLE_TRANSLATE_MODEL_ID}`,
		);
		if (fromCache) {
			this.applyCached(fromCache);
			return fromCache;
		}

		const response = await this.getGoogleTranslate(sourceLang, targetLang, text);

		if (!response || response.error) {
			this.isPending = false;
			console.debug(response?.error);
			return null;
		}

		this.sourceLang = sourceLang === 'auto' ? response.src : sourceLang;
		storage.settings.targetLang = targetLang;

		const sentence = this.buildSentence(response);
		const translated: Translated = {
			...response,
			sentence,
			sourceLang: this.sourceLang,
			targetLang,
			model,
		};

		this.translated = translated;
		this.isPending = false;

		return translated;
	}

	private async getGoogleTranslate(sourceLang: string, targetLang: string, text: string) {
		try {
			const response: GoogleTranslate & { error: string } = await browser.runtime.sendMessage<Message>({
				type: 'getTranslate',
				content: {
					sourceLang,
					targetLang,
					text,
				},
			});

			return response;
		} catch (error) {
			console.error('Error occurred while fetching translation: ', error);
		}
	}

	private addToHistory(orig: string = '', trans: string = '') {
		if (!storage.settings.historyEnable) return;
		if (!orig || !trans) return;

		const sourceLang = this.sourceLang;
		const targetLang = storage.settings.targetLang;
		const model = `${providerStore.selectedProvider.name}/${providerStore.selectedModel.model}`;

		const historyItem: HistoryItem = {
			sourceLang,
			targetLang,
			orig,
			trans,
			time: Date.now(),
			model,
		};

		storage.settings.history.push(historyItem);

		if (storage.settings.history.length >= storage.settings.historyLength) {
			storage.settings.history = storage.settings.history.slice(0, storage.settings.historyLength);
		}
	}

	private addToCache(googleResult: Translated, finalTranslatedText: string) {
		const cached: Translated = {
			...googleResult,
			sentence: {
				...googleResult.sentence,
				trans: finalTranslatedText,
			},
		};

		this.cache.push(cached);
		this.cacheIndex = -1; // last elem
		// console.log($state.snapshot(this.cache));
	}

	private findInCache(
		text: string,
		sourceLang: string,
		targetLang: string,
		model: string,
	): Translated | undefined {
		return this.cache.find(translated =>
			translated.sentence.orig === text &&
			translated.sourceLang === sourceLang &&
			translated.targetLang === targetLang &&
			translated.model === model,
		);
	}

	private applyCached(cached: Translated) {
		this.translated = cached;
		this.sourceLang = cached.sourceLang;
		storage.settings.targetLang = cached.targetLang;
	}

	private buildSentence(resp: GoogleTranslate): Sentence {
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
	}
}

export const store = new Store();
