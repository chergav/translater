const defaultSettings = {
	targetLang: chrome.i18n.getUILanguage(),
	theme: 'system',
	inlineButtonShow: true,
	textFieldButtonShow: true,
	showOriginalText: true,
	showTransliteration: true,
	blacklistDomainForInline: [],
	blacklistDomainForText: [],
	historyEnable: true,
	historyLength: 50,
	history: [],
	lockWindow: false,
	ttsVoiceByLang: {}
};

const themes = [
	{ key: 'light', value: 'theme_light' },
	{ key: 'dark', value: 'theme_dark' },
	{ key: 'system', value: 'theme_system' }
];

const languages = {
	'af': 'Afrikaans',
	'am': 'Amharic',
	'ar': 'Arabic',
	'az': 'Azerbaijani',
	'be': 'Belarusian',
	'bg': 'Bulgarian',
	'bn': 'Bengali',
	'bs': 'Bosnian',
	'ca': 'Catalan',
	'ceb': 'Cebuano',
	'co': 'Corsican',
	'cs': 'Czech',
	'cy': 'Welsh',
	'da': 'Danish',
	'de': 'German',
	'el': 'Greek',
	'en': 'English',
	'eo': 'Esperanto',
	'es': 'Spanish',
	'et': 'Estonian',
	'eu': 'Basque',
	'fa': 'Persian',
	'fi': 'Finnish',
	'fr': 'French',
	'fy': 'Frisian',
	'ga': 'Irish',
	'gd': 'Scottish Gaelic',
	'gl': 'Galician',
	'gu': 'Gujarati',
	'ha': 'Hausa',
	'haw': 'Hawaiian',
	'he': 'Hebrew',
	'hi': 'Hindi',
	'hmn': 'Monk',
	'hr': 'Croatian',
	'ht': 'Haitian',
	'hu': 'Hungarian',
	'hy': 'Armenian',
	'id': 'Indonesian',
	'ig': 'Igbo',
	'ilo': 'Ilocano',
	'is': 'Icelandic',
	'it': 'Italian',
	'iw': 'Hebrew',
	'ja': 'Japanese',
	'jv': 'Javanese',
	'ka': 'Georgian',
	'kk': 'Kazakh',
	'km': 'Khmer',
	'kn': 'Kannada',
	'ko': 'Korean',
	'ku': 'Kurdish',
	'ky': 'Kirghiz',
	'la': 'Latin',
	'lb': 'Luxembourgish',
	'lo': 'Laotian',
	'lt': 'Lithuanian',
	'lv': 'Latvian',
	'mg': 'Malagasy',
	'mi': 'Maori',
	'mk': 'Macedonian',
	'ml': 'Malayalam',
	'mn': 'Mongolian',
	'mr': 'Marathi',
	'ms': 'Malay',
	'mt': 'Maltese',
	'my': 'Myanmar',
	'ne': 'Nepali',
	'nl': 'Dutch',
	'no': 'Norwegian',
	'ny': 'Chewa',
	'om': 'Oromo',
	'pa': 'Punjabi',
	'pl': 'Polish',
	'ps': 'Pushto',
	'pt': 'Portuguese',
	'qu': 'Quechua',
	'ro': 'Romanian',
	'ru': 'Russian',
	'sd': 'Sindhi',
	'si': 'Sinhala',
	'sk': 'Slovak',
	'sl': 'Slovenian',
	'sm': 'Samoan',
	'sn': 'Shona',
	'so': 'Somali',
	'sq': 'Albanian',
	'sr': 'Serbian',
	'su': 'Sundanese',
	'sv': 'Swedish',
	'sw': 'Swahili',
	'sx': 'Sotho',
	'ta': 'Tamil',
	'te': 'Telugu',
	'tg': 'Tajiki',
	'th': 'Thai',
	'tl': 'Tagalog',
	'tr': 'Turkish',
	'uk': 'Ukrainian',
	'ur': 'Urdu',
	'uz': 'Uzbek',
	'vi': 'Vietnamese',
	'xh': 'Xosa',
	'yi': 'Yiddish',
	'yo': 'Yoruba',
	'zh-CN': 'Chinese (Simplified)',
	'zh-TW': 'Chinese (Traditional)',
	'zu': 'Zulu'
};

export { defaultSettings, themes, languages };
