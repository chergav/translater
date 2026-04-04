import type { GoogleTranslate, Sentence } from '~/types/google';
import type { TranslationProvider } from '~/types/providers';

export interface Settings {
	theme: Theme
	themeVariant: ThemeVariant
	accentColor: AccentColor
	fontSize: FontSize
	sourceLang: string
	targetLang: string
	inlineButtonShow: boolean
	textFieldButtonShow: boolean
	showOriginalText: boolean
	showTransliteration: boolean
	blacklistDomainForInline: string[]
	blacklistDomainForText: string[]
	historyEnable: boolean
	historyLength: number
	lockWindow: boolean
	ttsVoiceByLang: {
		[lang: string]: string
	};
	modelId: string
	fakeUserEmail?: string
	hideButtonForUserLanguage: boolean
	showPopupOnSelection: boolean
	popupMode: PopupMode
	simpleModeShowLangs: boolean
}

export interface SettingsSync {
	customProviders: TranslationProvider[]
}

export interface SettingsHistory {
	history: HistoryItem[]
}

export enum Theme {
	Light = 'light',
	Dark = 'dark',
	System = 'system',
}

export enum ThemeVariant {
	Slate = 'slate',
	Gray = 'gray',
	Zinc = 'zinc',
	Neutral = 'neutral',
	Stone = 'stone',
	Mauve = 'mauve',
}

export enum AccentColor {
	Amber = 'amber',
	Green = 'green',
	Blue = 'blue',
	Purple = 'purple',
	Pink = 'pink',
	Neutral = 'neutral',
}

export enum FontSize {
	ExtraSmall = 12,
	Small = 14,
	Normal = 16,
	Large = 18,
	ExtraLarge = 20,
}

export enum PopupMode {
	Full = 'full',
	Simple = 'simple',
	// Inline = 'inline',
}

export interface HistoryItem {
	sourceLang: string
	targetLang: string
	orig: string
	trans: string
	time: number
	model?: string
}

export type Message =
	{
		type: 'getTranslate'
		content: {
			text: string
			sourceLang: string
			targetLang: string
		}
	}
	| {
		type: 'getTranslateTTS'
		content: {
			text: string
			targetLang: string
		}
	}
	| { type: 'openOptionsPage' }
	| {
		type: 'openURL'
		content: {
			url: string
		}
	}
	| {
		type: 'createPopup'
		content: {
			text: string
		}
	}
	| { type: 'openTranslator' }
	| { type: 'ping' }
	| { type: 'loaded' }
	| { type: 'pingContentScript' }
	| {
		type: 'getCachedItem',
		content: {
			cacheKey: string
		}
	};

export type MessageConnectRequest =
	{
		type: 'translate'
		text: string
		targetLang: string
		currentModelId: string
		sourceLang?: string
		ignoreCache?: boolean
	}
	| { type: 'cancel' };

export type MessageConnectResponse =
	{ type: 'translation-start' }
	| {
		type: 'translation-chunk',
		chunk: string
		sourceLang?: string
	}
	| {
		type: 'translation-complete'
		finalText: string
		sourceLang?: string
		cacheKey?: string
	}
	| { type: 'translation-cancel' }
	| {
		type: 'translation-error'
		error: string
	} | {
		type: 'download-progress',
		percent: number
	};

export interface Language {
	language: string;
	code: string;
}

export interface GoogleTTSResponse {
	status: boolean
	data?: number[]
}

export interface CacheTTS {
	targetLang: string
	text: string
	data: number[]
}

export interface TransSegment {
	text: string;
	alternatives: string[];
	rawSegment: string
}

export interface BaseTranslation {
	sourceLang: string
	targetLang: string
}

export interface TranslationGoogle extends GoogleTranslate {
	sentence: Sentence
}

export interface TranslationAi {
	text: string
	sourceLang?: string
	isStreaming?: boolean
}
