import type { GoogleTranslate, Sentence } from '~/types/google';
import type { TranslationProvider } from '~/types/providers';

export interface Settings {
	theme: Theme
	accentColor: ThemeColor
	contrastLevel: ContrastLevel
	customTheme: string
	seedColor: string
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
	ttsProvider: TTSProvider
	modelId: string
	fakeUserEmail?: string
	hideButtonForUserLanguage: boolean
	showPopupOnSelection: boolean
	popupMode: PopupMode
	simpleModeShowLangs: boolean
	motionPreference: MotionPreference
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

export enum ContrastLevel {
	Default = 0.0,
	Medium = 0.5,
	High = 1.0,
}

export enum Contrast {
	Default = 'default',
	Medium = 'medium',
	High = 'high',
}

export enum ThemeColor {
	Monochrome = 'neutral', // "monochrome" is "neutral" for backward compatibility
	Yellow = 'yellow',
	Amber = 'amber',
	Orange = 'orange',
	Blue = 'blue',
	Cyan = 'cyan',
	Green = 'green',
	Purple = 'purple',
	Pink = 'pink',
	Red = 'red',
	Teal = 'teal',
	Custom = 'custom',
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
}

export enum MotionPreference {
	Off = 'off',
	System = 'system',
	On = 'on',
}
export enum TTSProvider {
	Auto = 'auto',
	Google = 'google',
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
