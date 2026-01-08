import { MessageConnectRequest, MessageConnectResponse } from '~/types';

interface TranslationCallbacks {
	onStart?: () => void;
	onChunk?: (chunk: string, sourceLang?: string) => void;
	onComplete?: (finalText: string, sourceLang?: string) => void;
	onCancel?: () => void;
	onError?: (error: string) => void;
	onDownloadProgress?: (percent: number) => void
}

class TranslationClient {
	private port: Browser.runtime.Port | null = null;
	private isTranslating = false;
	private callbacks: TranslationCallbacks = {};

	private ensureConnection(): Browser.runtime.Port {
		if (this.port) {
			return this.port;
		}

		console.log('Creating new translation port connection');

		this.port = browser.runtime.connect({ name: 'translation-stream' });
		this.port.onMessage.addListener(this.handleMessage);

		this.port.onDisconnect.addListener(() => {
			console.log('Translation port disconnected');

			if (browser.runtime.lastError) {
				console.warn('Port disconnect error:', browser.runtime.lastError.message);
			}

			this.port = null;

			if (this.isTranslating) {
				this.isTranslating = false;
				this.callbacks.onError?.('Connection lost. Please try again.');
				this.callbacks = {};
			}
		});

		return this.port;
	}

	private handleMessage = (message: MessageConnectResponse) => {
		switch (message.type) {
			case 'translation-start':
				this.isTranslating = true;
				this.callbacks.onStart?.();
				break;
			case 'download-progress':
				this.callbacks.onDownloadProgress?.(message.percent);
				break;
			case 'translation-chunk':
				this.callbacks.onChunk?.(message.chunk, message.sourceLang);
				break;
			case 'translation-complete':
				this.isTranslating = false;
				this.callbacks.onComplete?.(message.finalText, message.sourceLang);
				break;
			case 'translation-cancel':
				this.isTranslating = false;
				this.callbacks.onCancel?.();
				console.log('Translation canceled');
				break;
			case 'translation-error':
				this.isTranslating = false;
				this.callbacks.onError?.(message.error);
				break;
			default:
				console.error(`Unknown message: ${JSON.stringify(message)}`);
				break;
		}
	};

	public translateText(
		text: string,
		targetLang: string,
		currentModelId: string,
		callbacks: TranslationCallbacks,
		sourceLang?: string,
	) {
		if (this.isTranslating) {
			this.cancelTranslation();
		}

		this.callbacks = callbacks;

		const port = this.ensureConnection();
		port.postMessage({
			type: 'translate',
			text,
			targetLang,
			currentModelId,
			sourceLang,
		} satisfies MessageConnectRequest);
	}

	public cancelTranslation() {
		if (!this.port) return;

		this.port.postMessage({
			type: 'cancel',
		} satisfies MessageConnectRequest);
	}
}

export const translator = new TranslationClient();
