import type { CacheTTS, TranslationAi, Message, HistoryItem, SettingsHistory } from '~/types';
import type { GoogleTranslate, Translated, Sentence } from '~/types/google';
import { GOOGLE_TRANSLATE_MODEL_ID } from '~/types/providers';
import { storage } from '~/shared/storage.svelte';
import { normalizeLanguageCode } from '~/shared/languages';
import { providerStore } from '~/entrypoints/options/lib/Providers/providerStore.svelte';
import { translator } from './utils/TranslationClient';

class Store {
	public errors = $state<string[]>([]);
	public hostname = $state<string>('');
	public detectedLang = $state<string>();
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
	private isProviderGoogle = $derived<boolean>(storage.settings.modelId === GOOGLE_TRANSLATE_MODEL_ID);

	public async translate() {
		const textToTranslate = this.textToTranslate.trim();
		if (!textToTranslate) return;

		if (storage.settings.sourceLang === storage.settings.targetLang) {
			this.errors.push('Source and target languages must be different');
			return;
		}

		this.translated = null;
		this.translationAi = null;
		// this.detectedLang = undefined;
		this.errors = [];

		const [googleResult, aiResult] = await Promise.all([
			this.translateGoogle(textToTranslate),
			!this.isProviderGoogle ? this.translateAi(textToTranslate) : Promise.resolve(null),
		]);

		if (this.isProviderGoogle && !googleResult) {
			this.errors.push('Google Translate service error');
			return;
		}

		if (!this.isProviderGoogle && !aiResult) return;

		const finalTranslatedText = !this.isProviderGoogle && aiResult
			? aiResult
			: googleResult?.sentence.trans || '';

		this.addToHistory(textToTranslate, finalTranslatedText);
		if (googleResult) this.addToCache(googleResult, finalTranslatedText);
	}

	public stopTranslation = () => {
		translator.cancelTranslation();
	};

	public resetTranslateStore = () => {
		this.selectedText = '';
		this.textToTranslate = '';
		this.detectedLang = undefined;
		this.translated = null;
		this.translationAi = null;
		this.errors = [];
	};

	public openPopup = () => {
		this.showPopup = true;
		this.textToTranslate = this.selectedText;
		this.translate();
	};

	public reTranslate = () => {
		if (this.textToTranslate) {
			this.translate();
		}
	};

	public reverseTranslation = () => {
		if (!this.detectedLang) return;

		const normalizedDetected = normalizeLanguageCode(this.detectedLang);
		if (!normalizedDetected) return;

		if (storage.settings.sourceLang !== 'auto') {
			storage.settings.sourceLang = storage.settings.targetLang;
		}

		storage.settings.targetLang = normalizedDetected;

		this.textToTranslate = this.isProviderGoogle
			? this.translated?.sentence.trans || ''
			: this.translationAi?.text || '';

		this.translate();
	};

	public setCacheItem(index: number) {
		this.cacheIndex = index;
		const item = this.cache.at(this.cacheIndex);
		if (!item) return;

		this.translated = item;
		if (this.translationAi) this.translationAi.text = item.sentence.trans || '';
		this.detectedLang = item.src;
		storage.settings.targetLang = item.targetLang;
	}

	private async translateAi(text: string): Promise<string | null> {
		const sourceLang = storage.settings.sourceLang !== 'auto' ? storage.settings.sourceLang : undefined;
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
							this.detectedLang ??= sourceLang;
						}
					},
					onComplete: (finalText, sourceLang) => {
						if (this.translationAi) {
							this.downloadProgress = null;
							this.translationAi.text = finalText;
							this.translationAi.isStreaming = false;
						}
						if (sourceLang) {
							this.detectedLang ??= sourceLang;
						}
						resolve(finalText);
					},
					onError: error => {
						console.log('Translation error:', error);
						this.errors.push(error);
						if (this.translationAi) {
							this.downloadProgress = null;
							this.translationAi.isStreaming = false;
						}
						resolve(null);
					},
					onCancel: () => {
						console.log('Translation canceled');
						if (this.translationAi) {
							this.downloadProgress = null;
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

		const sourceLang =  storage.settings.sourceLang;
		const targetLang = storage.settings.targetLang;

		const fromCache = this.findInCache(
			text,
			this.detectedLang || sourceLang,
			targetLang,
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

		this.detectedLang = response.src;

		const sentence = this.buildSentence(response);
		const translated: Translated = {
			...response,
			sentence,
			sourceLang: this.detectedLang,
			targetLang,
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

	private async addToHistory(orig: string = '', trans: string = '') {
		if (!storage.settings.historyEnable) return;
		if (!orig || !trans) return;

		const sourceLang = this.detectedLang || storage.settings.sourceLang;
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

		const { history = [] } = await browser.storage.local.get<SettingsHistory>(['history']);
		history.push(historyItem);

		const trimmed = history.length > storage.settings.historyLength
			? history.slice(-storage.settings.historyLength)
			: history;

		await browser.storage.local.set({ history: trimmed });
	}

	private isDuplicateOfLastCached(item: Translated): boolean {
		const last = this.cache.at(-1);
		if (!last) return false;

		return (
			last.sourceLang === item.sourceLang &&
			last.targetLang === item.targetLang &&
			last.sentence.orig === item.sentence.orig &&
			last.sentence.trans === item.sentence.trans
		);
	}

	private addToCache(googleResult: Translated, finalTranslatedText: string) {
		const cached: Translated = {
			...googleResult,
			sentence: {
				...googleResult.sentence,
				trans: finalTranslatedText,
			},
		};

		if (!this.isDuplicateOfLastCached(cached)) {
			this.cache.push(cached);
		}

		this.cacheIndex = -1; // reset to last element
	}

	private findInCache(
		text: string,
		sourceLang: string,
		targetLang: string,
	): Translated | undefined {
		return this.cache.find(translated =>
			translated.sentence.orig === text &&
			translated.sourceLang === sourceLang &&
			translated.targetLang === targetLang,
		);
	}

	private applyCached(cached: Translated) {
		this.translated = cached;
		this.detectedLang = cached.sourceLang;
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
