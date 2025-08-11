import type { GoogleTranslate, Translated, Sentence } from '~/shared/translate.types';
import type { CacheTTS } from '~/shared/types';
import { storage } from '~/shared/storage.svelte';
import { historyAddItem } from './history.svelte';
import { fetchTranslate } from './utils/fetchTranslate';

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
	public cacheTranslate = $state<Translated[]>([]);
	public cacheIndex = $state<number>(-1);
	public isPending = $state<boolean>(false);
	public audioContextSource = $state<AudioBufferSourceNode | null>(null);
	public cacheTTS = $state<CacheTTS[]>([]);
	public textToHighlight = $state<string>('');

	public async getTranslate() {
		this.translated = null;
		const text = this.textToTranslate.trim();
		if (!text) return;

		const srcLang = this.sourceLang;
		const tgtLang = storage.settings.targetLang;

		this.isPending = true;

		const fromCache = this.findInCache(text, srcLang, tgtLang);
		if (fromCache) {
			this.applyCached(fromCache);
			return;
		}

		const resp = await fetchTranslate(srcLang, tgtLang, text);
		if (!resp) {
			this.errors.push('Translation service error');
			this.isPending = false;
			return;
		}

		const sentence = this.buildSentence(resp);
		const translatedObj: Translated = {
			...resp,
			sentence,
			sourceLang: srcLang,
			targetLang: tgtLang,
		};

		this.cacheTranslate.push(translatedObj);
		this.cacheIndex = -1;
		this.sourceLang = srcLang === 'auto' ? resp.src : srcLang;
		storage.settings.targetLang = tgtLang;

		historyAddItem({
			sourceLang: resp.src,
			targetLang: tgtLang,
			orig: sentence.orig,
			trans: sentence.trans,
			time: Date.now(),
		});

		this.isPending = false;
		this.translated = translatedObj;
	}

	public resetTranslate() {
		this.selectedText = '';
		this.textToTranslate = '';
		this.sourceLang = 'auto';
		this.translated = null;
	}

	private findInCache(
		text: string,
		srcLang: string,
		tgtLang: string,
	): Translated | undefined {
		return this.cacheTranslate.find(item =>
			item.sentence.orig === text &&
			item.sourceLang === srcLang &&
			item.targetLang === tgtLang,
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
