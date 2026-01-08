export type ProviderProtocol = 'openai-stream' | 'simple-api' | 'browser-api' | 'custom-backend';

export enum ProviderId {
	GoogleTranslate = 'google-translate',
	MyMemory = 'mymemory',
	TranslatorApi = 'translator-api',
}

export interface TranslationProvider {
	id: string;
	name: string;
	protocol: ProviderProtocol;
	isBuiltin: boolean;
	requiresSubscription: boolean;
	models: TranslationModel[];
	baseUrl?: string;
	apiKey?: string;
	note?: string
}

export interface TranslationModel {
	id: string;
	model: string;
	maxInputChars?: number;
	// costPer1kTokens?: number;
}

export interface TranslationRequest {
	text: string;
	sourceLang: string;
	targetLang: string;
	providerId: string;
	modelId: string;
}

export interface TranslationResponse {
	translatedText: string;
	provider: string;
	model: string;
	tokensUsed?: number;
}

export const GOOGLE_TRANSLATE_MODEL_ID = 'google-translate-free' as const;
