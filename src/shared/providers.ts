import { type TranslationProvider, ProviderId, GOOGLE_TRANSLATE_MODEL_ID } from '~/types/providers';

export const builtinProviders: TranslationProvider[] = [
	{
		id: ProviderId.GoogleTranslate,
		name: 'Google Translate',
		protocol: 'simple-api',
		requiresSubscription: false,
		isBuiltin: true,
		models: [
			{
				id: GOOGLE_TRANSLATE_MODEL_ID,
				model: 'google-translate-free',
				maxInputChars: 5000,
			},
		],
	},
	{
		id: ProviderId.MyMemory,
		name: 'MyMemory',
		protocol: 'simple-api',
		isBuiltin: true,
		requiresSubscription: false,
		note: 'Limit: 500 characters per request, 50,000 characters per day.\n<a href="https://mymemory.translated.net/doc/usagelimits.php" target="_blank" rel="noopener noreferrer" class="underline">MyMemory: API usage limits</a>',
		models: [
			{
				id: 'mymemory-free',
				model: 'mymemory-free',
				maxInputChars: 500,
			},
		],
	},
	{
		id: ProviderId.TranslatorApi,
		name: 'Translator API',
		protocol: 'browser-api',
		isBuiltin: true,
		requiresSubscription: false,
		note: 'Translator and Language Detector APIs are experimental technology.\nCurrently supported in Chrome 138+ and Opera 122+.\nMay have geographical restrictions.\nWorks offline after model download.',
		models: [
			{
				id: 'translator-api-free',
				model: 'translator-api-free',
				maxInputChars: 5000,
			},
		],
	},
	// {
	// 	id: 'openai',
	// 	name: 'OpenAI',
	// 	protocol: 'custom-backend',
	// 	isBuiltin: true,
	// 	requiresSubscription: true,
	// 	models: [
	// 		{
	// 			id: 'gpt-4o',
	// 			model: 'gpt-4o',
	// 		},
	// 		{
	// 			id: 'gpt-4o-mini',
	// 			model: 'gpt-4o-mini',
	// 		},
	// 	],
	// },
	// {
	// 	id: 'google',
	// 	name: 'Google',
	// 	protocol: 'custom-backend',
	// 	isBuiltin: true,
	// 	requiresSubscription: true,
	// 	models: [
	// 		{
	// 			id: 'gemini-2.0-flash-exp',
	// 			model: 'gemini-2.0-flash-exp',
	// 		},
	// 		{
	// 			id: 'gemini-1.5-pro',
	// 			model: 'gemini-1.5-pro',
	// 		},
	// 	],
	// },
];
