declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	namespace svelteHTML {
		interface HTMLAttributes {
			onclickoutside?: (event: CustomEvent) => void
		}
	}

	interface NavigatorUABrand {
		brand: string;
		version: string;
	}

	interface NavigatorUAData {
		brands: NavigatorUABrand[];
		platform: string;
	}

	interface Navigator {
		userAgentData?: NavigatorUAData;
	}

	interface AICreateMonitor extends EventTarget {
		addEventListener(
			type: 'downloadprogress',
			listener: (event: ProgressEvent) => void,
			options?: AddEventListenerOptions | boolean
		): void;
		removeEventListener(
			type: 'downloadprogress',
			listener: (event: ProgressEvent) => void,
			options?: EventListenerOptions | boolean
		): void;
	}

	type Availability = 'available' | 'downloadable' | 'downloading' | 'unavailable';

	class LanguageDetector {
		readonly inputQuota: number;
		readonly expectedInputLanguages: string[];

		static availability(options: {
			expectedInputLanguages: string[]
		}): Promise<Availability>;

		static create(options: {
			expectedInputLanguages: string[];
			// monitor?: (monitor: ProgressEvent) => void;
			signal?: AbortSignal;
		}): Promise<LanguageDetector>;

		detect(input: string, options?: {
			signal?: AbortSignal;
		}): Promise<Array<{
			detectedLanguage: string;
			confidence: number
		}>>;

		measureInputUsage(input: string, options?: {
			signal?: AbortSignal;
		}): Promise<number>;

		destroy(): void;
	}

	class Translator {
		readonly inputQuota: number;
		readonly sourceLanguage: string;
		readonly targetLanguage: string;

		static availability(options: {
			sourceLanguage: string;
			targetLanguage: string;
		}): Promise<Availability>;

		static create(options: {
			sourceLanguage: string;
			targetLanguage: string;
			monitor?: (m: AICreateMonitor) => void;
			signal?: AbortSignal;
		}): Promise<Translator>;

		translate(input: string, options?: {
			signal?: AbortSignal;
		}): Promise<string>;

		translateStreaming(input: string, options?: {
			signal?: AbortSignal;
		}): ReadableStream<string>;

		measureInputUsage(input: string, options?: {
			signal?: AbortSignal;
		}): Promise<number>;

		destroy(): void;
	}
}

export { };
