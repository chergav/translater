import type { CacheTTS, TranslationAi, Message, HistoryItem, SettingsHistory } from '~/types';
import type { Translated } from '~/types/google';
import { GOOGLE_TRANSLATE_MODEL_ID } from '~/types/providers';
import { storage } from '~/shared/storage.svelte';
import { normalizeLanguageCode } from '~/shared/languages';
import { providerStore } from '~/entrypoints/options/lib/Providers/providerStore.svelte';
import { translator } from './utils/TranslationClient';

interface CacheEntry {
	googleKey?: string
	aiKey?: string
}

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
	public cacheKeys = $state<CacheEntry[]>([]);
	public cacheIndex = $state<number>(-1);
	public isPending = $state<boolean>(false);
	public audioContextSource = $state<AudioBufferSourceNode | null>(null);
	public cacheTTS = $state<CacheTTS[]>([]);
	public textToHighlight = $state<string>('');
	public downloadProgress = $state<number | null>(null);
	private isProviderGoogle = $derived<boolean>(storage.settings.modelId === GOOGLE_TRANSLATE_MODEL_ID);
	public showFooter = $derived<boolean>(
		!!this.translated?.dict ||
		!!this.translated?.definitions ||
		!!this.translated?.examples,
	);
	public isCachedItem = $derived<boolean>(this.cacheIndex !== -1 && this.translationAi === null);

	public async translate(ignoreCache: boolean = false) {
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
			!this.isProviderGoogle ? this.translateAi(textToTranslate, ignoreCache) : Promise.resolve(null),
		]);

		if (this.isProviderGoogle && !googleResult) {
			return;
		}

		if (!this.isProviderGoogle && !aiResult) return;

		const finalTranslatedText = !this.isProviderGoogle && aiResult
			? aiResult.text
			: googleResult?.sentence.trans || '';

		this.addToHistory(textToTranslate, finalTranslatedText);
		this.addKeysToCache(googleResult?.cacheKey, aiResult?.cacheKey);
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

	public reTranslateIgnoreCache = () => {
		if (this.textToTranslate) {
			this.translate(true);
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

	public async setCacheItem(index: number) {
		this.cacheIndex = index;
		const item = this.cacheKeys.at(this.cacheIndex);
		if (!item) return;

		const googleCache = await this.getCachedItem<Translated>(item.googleKey);
		const aiCache = await this.getCachedItem<TranslationAi>(item.aiKey);

		this.translated = googleCache;
		this.translationAi = aiCache;
		this.detectedLang = googleCache?.sourceLang;
		storage.settings.targetLang = googleCache?.targetLang ?? storage.settings.targetLang;
	}

	private async getCachedItem<T>(cacheKey?: string): Promise<T | null> {
		if (!cacheKey) return null;

		try {
			const response: T = await browser.runtime.sendMessage<Message>({
				type: 'getCachedItem',
				content: { cacheKey },
			});

			return response;
		} catch (error) {
			console.error('Error get cached item: ', error);
			return null;
		}
	}

	private async translateAi(text: string, ignoreCache?: boolean): Promise<{
		text: string,
		cacheKey?: string
	} | null> {
		const sourceLang = storage.settings.sourceLang !== 'auto' ? storage.settings.sourceLang : undefined;
		const targetLang = storage.settings.targetLang;
		const modelId = storage.settings.modelId;

		return new Promise<{
			text: string,
			cacheKey?: string
		} | null>(resolve => {
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
					onComplete: (finalText, sourceLang, cacheKey) => {
						if (this.translationAi) {
							this.downloadProgress = null;
							this.translationAi.text = finalText;
							this.translationAi.isStreaming = false;
						}
						if (sourceLang) {
							this.detectedLang ??= sourceLang;
						}
						resolve({
							text: finalText,
							cacheKey,
						});
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
				ignoreCache,
			);
		});
	}

	private async translateGoogle(text: string): Promise<Translated | null> {
		this.isPending = true;

		const sourceLang =  storage.settings.sourceLang;
		const targetLang = storage.settings.targetLang;

		const response = await this.getGoogleTranslate(sourceLang, targetLang, text);

		if (!response || response.error) {
			this.isPending = false;
			console.debug(response?.error);
			this.errors.push(response?.error || '');
			return null;
		}

		this.detectedLang = response.src;
		this.translated = response;
		this.isPending = false;

		return response;
	}

	private async getGoogleTranslate(
		sourceLang: string,
		targetLang: string,
		text: string,
	): Promise<Translated | undefined> {
		try {
			const response: Translated = await browser.runtime.sendMessage<Message>({
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

	private addKeysToCache(googleKey?: string, aiKey?: string) {
		const last = this.cacheKeys.at(-1);

		if (last?.googleKey === googleKey && last?.aiKey === aiKey) {
			return;
		}

		this.cacheKeys.push({
			googleKey,
			aiKey,
		});

		this.cacheIndex = -1;
	}
}

export const store = new Store();
