const defaultSettings = {
	targetLang: chrome.i18n.getUILanguage(),
	theme: 'system',
	inlineButtonShow: true,
	textFieldButtonShow: true,
	showOriginalText: true,
	showTransliteration: true,
	blacklistDomainForInline: [],
	blacklistDomainForText: [],
	historyLength: 50,
	history: [],
	pinWindow: false
};

const themes = [
	{ key: 'light', value: 'theme_light' },
	{ key: 'dark', value: 'theme_dark' },
	{ key: 'system', value: 'theme_system' }
];

const languages = [
	{
		key: 'af',
		value: 'Afrikaans'
	},
	{
		key: 'sq',
		value: 'Albanian'
	},
	{
		key: 'am',
		value: 'Amharic'
	},
	{
		key: 'ar',
		value: 'Arabic'
	},
	{
		key: 'hy',
		value: 'Armenian'
	},
	{
		key: 'az',
		value: 'Azerbaijani'
	},
	{
		key: 'eu',
		value: 'Basque'
	},
	{
		key: 'be',
		value: 'Belarusian'
	},
	{
		key: 'bn',
		value: 'Bengali'
	},
	{
		key: 'bs',
		value: 'Bosnian'
	},
	{
		key: 'bg',
		value: 'Bulgarian'
	},
	{
		key: 'ca',
		value: 'Catalan'
	},
	{
		key: 'ceb',
		value: 'Cebuano'
	},
	{
		key: 'ny',
		value: 'Chewa'
	},
	{
		key: 'zh-CN',
		value: 'Chinese (Simplified)'
	},
	{
		key: 'zh-TW',
		value: 'Chinese (Traditional)'
	},
	{
		key: 'co',
		value: 'Corsican'
	},
	{
		key: 'hr',
		value: 'Croatian'
	},
	{
		key: 'cs',
		value: 'Czech'
	},
	{
		key: 'da',
		value: 'Danish'
	},
	{
		key: 'nl',
		value: 'Dutch'
	},
	{
		key: 'en',
		value: 'English'
	},
	{
		key: 'eo',
		value: 'Esperanto'
	},
	{
		key: 'et',
		value: 'Estonian'
	},
	{
		key: 'fi',
		value: 'Finnish'
	},
	{
		key: 'fr',
		value: 'French'
	},
	{
		key: 'fy',
		value: 'Frisian'
	},
	{
		key: 'gl',
		value: 'Galician'
	},
	{
		key: 'ka',
		value: 'Georgian'
	},
	{
		key: 'de',
		value: 'German'
	},
	{
		key: 'el',
		value: 'Greek'
	},
	{
		key: 'gu',
		value: 'Gujarati'
	},
	{
		key: 'ht',
		value: 'Haitian'
	},
	{
		key: 'ha',
		value: 'Hausa'
	},
	{
		key: 'haw',
		value: 'Hawaiian'
	},
	{
		key: 'he',
		value: 'Hebrew'
	},
	{
		key: 'iw',
		value: 'Hebrew'
	},
	{
		key: 'hi',
		value: 'Hindi'
	},
	{
		key: 'hu',
		value: 'Hungarian'
	},
	{
		key: 'is',
		value: 'Icelandic'
	},
	{
		key: 'ig',
		value: 'Igbo'
	},
	{
		key: 'id',
		value: 'Indonesian'
	},
	{
		key: 'ga',
		value: 'Irish'
	},
	{
		key: 'it',
		value: 'Italian'
	},
	{
		key: 'ja',
		value: 'Japanese'
	},
	{
		key: 'jv',
		value: 'Javanese'
	},
	{
		key: 'kn',
		value: 'Kannada'
	},
	{
		key: 'kk',
		value: 'Kazakh'
	},
	{
		key: 'km',
		value: 'Khmer'
	},
	{
		key: 'ky',
		value: 'Kirghiz'
	},
	{
		key: 'ko',
		value: 'Korean'
	},
	{
		key: 'ku',
		value: 'Kurdish'
	},
	{
		key: 'lo',
		value: 'Laotian'
	},
	{
		key: 'la',
		value: 'Latin'
	},
	{
		key: 'lv',
		value: 'Latvian'
	},
	{
		key: 'lt',
		value: 'Lithuanian'
	},
	{
		key: 'lb',
		value: 'Luxembourgish'
	},
	{
		key: 'mk',
		value: 'Macedonian'
	},
	{
		key: 'mg',
		value: 'Malagasy'
	},
	{
		key: 'ms',
		value: 'Malay'
	},
	{
		key: 'ml',
		value: 'Malayalam'
	},
	{
		key: 'mt',
		value: 'Maltese'
	},
	{
		key: 'mi',
		value: 'Maori'
	},
	{
		key: 'mr',
		value: 'Marathi'
	},
	{
		key: 'mn',
		value: 'Mongolian'
	},
	{
		key: 'hmn',
		value: 'Monk'
	},
	{
		key: 'my',
		value: 'Myanmar'
	},
	{
		key: 'ne',
		value: 'Nepali'
	},
	{
		key: 'no',
		value: 'Norwegian'
	},
	{
		key: 'fa',
		value: 'Persian'
	},
	{
		key: 'pl',
		value: 'Polish'
	},
	{
		key: 'pt',
		value: 'Portuguese'
	},
	{
		key: 'pa',
		value: 'Punjabi'
	},
	{
		key: 'ps',
		value: 'Pushto'
	},
	{
		key: 'ro',
		value: 'Romanian'
	},
	{
		key: 'ru',
		value: 'Russian'
	},
	{
		key: 'sm',
		value: 'Samoan'
	},
	{
		key: 'gd',
		value: 'Scottish Gaelic'
	},
	{
		key: 'sr',
		value: 'Serbian'
	},
	{
		key: 'sn',
		value: 'Shona'
	},
	{
		key: 'sd',
		value: 'Sindhi'
	},
	{
		key: 'si',
		value: 'Sinhala'
	},
	{
		key: 'sk',
		value: 'Slovak'
	},
	{
		key: 'sl',
		value: 'Slovenian'
	},
	{
		key: 'so',
		value: 'Somali'
	},
	{
		key: 'sx',
		value: 'Sotho'
	},
	{
		key: 'es',
		value: 'Spanish'
	},
	{
		key: 'su',
		value: 'Sundanese'
	},
	{
		key: 'sw',
		value: 'Swahili'
	},
	{
		key: 'sv',
		value: 'Swedish'
	},
	{
		key: 'tl',
		value: 'Tagalog'
	},
	{
		key: 'tg',
		value: 'Tajiki'
	},
	{
		key: 'ta',
		value: 'Tamil'
	},
	{
		key: 'te',
		value: 'Telugu'
	},
	{
		key: 'th',
		value: 'Thai'
	},
	{
		key: 'tr',
		value: 'Turkish'
	},
	{
		key: 'uk',
		value: 'Ukrainian'
	},
	{
		key: 'ur',
		value: 'Urdu'
	},
	{
		key: 'uz',
		value: 'Uzbek'
	},
	{
		key: 'vi',
		value: 'Vietnamese'
	},
	{
		key: 'cy',
		value: 'Welsh'
	},
	{
		key: 'xh',
		value: 'Xosa'
	},
	{
		key: 'yi',
		value: 'Yiddish'
	},
	{
		key: 'yo',
		value: 'Yoruba'
	},
	{
		key: 'zu',
		value: 'Zulu'
	},
	{
		key: 'qu',
		value: 'Quechua'
	},
	{
		key: 'om',
		value: 'Oromo'
	},
	{
		key: 'ilo',
		value: 'Ilocano'
	}
];

export { defaultSettings, themes, languages };
