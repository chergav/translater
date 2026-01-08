export const unavailableErrorMessage = 'Browser Translation API is not available.\nThis feature only works in Chrome 138+, and Opera 122+.\nAvailability may be subject to geographical restrictions.';

export async function isBrowserTranslationAvailable(): Promise<boolean> {
	if (typeof LanguageDetector === 'undefined' || typeof Translator === 'undefined') {
		return false;
	}

	try {
		const detectorCheck = await LanguageDetector.availability({
			expectedInputLanguages: ['en', 'es', 'fr', 'de', 'ru', 'zh', 'ja', 'ko'],
		});

		if (detectorCheck === 'unavailable') {
			return false;
		}

		const translatorCheck = await Translator.availability({
			sourceLanguage: 'en',
			targetLanguage: 'es',
		});

		return translatorCheck !== 'unavailable';
	} catch (error) {
		console.error('Error checking browser translation availability:', error);
		return false;
	}
}

/**
 * Detect language of the text
 */
async function detectLanguage(text: string, signal: AbortSignal): Promise<string> {
	try {
		const detector = await LanguageDetector.create({
			expectedInputLanguages: ['en'],
			signal,
		});

		if (signal.aborted) {
			detector.destroy();
			throw new DOMException('Translation cancelled', 'AbortError');
		}

		const results = await detector.detect(text, { signal });

		detector.destroy();

		if (results.length > 0) {
			const best = results[0];

			if (best.detectedLanguage === 'und' || best.confidence < 0.1) {
				console.warn('Low confidence language detection, falling back to English');
				return 'en';
			}

			return best.detectedLanguage;
		}

		return 'en';
	} catch (error) {
		if (signal.aborted) {
			throw new DOMException('Translation cancelled', 'AbortError');
		}
		console.error('Language detection failed:', error);
		return 'en';
	}
}

/**
 * Translate text using Browser Translation API (returns stream)
 */
export async function translateWithTranslationAPI(
	text: string,
	targetLang: string,
	signal: AbortSignal,
	onDownloadProgress?: (percent: number) => void,
	sourceLanguage?: string,
): Promise<{
	stream: ReadableStream<string>
	sourceLang: string
}> {
	const isTranslationAPIAvailable = await isBrowserTranslationAvailable();

	if (!isTranslationAPIAvailable) {
		throw new Error(unavailableErrorMessage);
	}

	const sourceLang = sourceLanguage ?? await detectLanguage(text, signal);

	const availability = await Translator.availability({
		sourceLanguage: sourceLang,
		targetLanguage: targetLang,
	});

	if (availability === 'unavailable') {
		throw new Error(`Translation from ${sourceLang} to ${targetLang} is not supported`);
	}

	if (availability === 'downloadable' || availability === 'downloading') {
		console.log(`Model for ${sourceLang} -> ${targetLang} needs to be downloaded...`);
	}

	if (signal.aborted) {
		throw new DOMException('Translation cancelled', 'AbortError');
	}

	const translator = await Translator.create({
		sourceLanguage: sourceLang,
		targetLanguage: targetLang,
		monitor: onDownloadProgress
			? m => {
				m.addEventListener('downloadprogress', e => {
					onDownloadProgress(e.loaded);
				});
			}
			: undefined,
		signal,
	});

	if (signal.aborted) {
		translator.destroy();
		throw new DOMException('Translation cancelled', 'AbortError');
	}

	return {
		stream: translator.translateStreaming(text, { signal }),
		sourceLang,
	};
}

/**
 * Get list of supported language pairs
 */
export async function getSupportedLanguagePairs(): Promise<Array<{
	source: string,
	target: string
}>> {
	if (typeof Translator === 'undefined') {
		return [];
	}

	// Common languages to check
	const commonLangs = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar'];
	const pairs: Array<{
		source: string,
		target: string
	}> = [];

	for (const source of commonLangs) {
		for (const target of commonLangs) {
			if (source === target) continue;

			try {
				const availability = await Translator.availability({
					sourceLanguage: source,
					targetLanguage: target,
				});

				if (availability !== 'unavailable') {
					pairs.push({
						source,
						target,
					});
				}
			} catch {
				// Skip if check fails
			}
		}
	}

	return pairs;
}
