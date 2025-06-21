export interface Settings {
	theme: Theme
	themeVariant: ThemeVariant
	accentColor: AccentColor
	fontSize: FontSize
	targetLang: string
	inlineButtonShow: boolean
	textFieldButtonShow: boolean
	showOriginalText: boolean
	showTransliteration: boolean
	blacklistDomainForInline: string[]
	blacklistDomainForText: string[]
	historyEnable: boolean
	historyLength: number
	history: HistoryItem[],
	lockWindow: boolean
	ttsVoiceByLang: {
		[lang: string]: string
	};
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
}

export enum AccentColor {
	Amber = 'amber',
	Green = 'green',
	Blue = 'blue',
	Purple = 'purple',
	Pink = 'pink',
}

export enum FontSize {
	ExtraSmall = 12,
	Small = 14,
	Normal = 16,
	Large = 18,
	ExtraLarge = 20,
}

export interface HistoryItem {
	sourceLang: string
	targetLang: string
	orig?: string
	trans?: string
	time: number
}

export interface Message {
	type: 'getTranslate'
		| 'getTranslateTTS'
		| 'openOptionsPage'
		| 'openURL'
		| 'openTranslater'
		| 'createPopup',
	content: {
		sourceLang?: string
		targetLang?: string
		selectedText?: string
		lang?: string
		text?: string
		url?: string
	}
}

export interface Language {
	language: string;
	code: string;
}

export interface GoogleTTSResponse {
	status: boolean
	data?: number[]
}

export interface CacheTTS {
	lang: string
	text: string
	data: number[]
}

export interface TransSegment {
	text: string;
	alternatives: string[];
	rawSegment: string
}
