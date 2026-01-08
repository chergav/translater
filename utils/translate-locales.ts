import type { GoogleTranslate } from '../src/types/google';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

interface Messages {
	[key: string]: {
		message: string
	}
}

const generateRequestURL = ({ targetLang, text }: {
	targetLang: string,
	text: string
}) => {
	const searchParams = new URLSearchParams({
		// client: 'tw-ob',
		client: 'gtx',
		sl: 'en',
		tl: targetLang,
		ie: 'UTF-8',
		oe: 'UTF-8',
		dj: '1',
		dt: 't',
		q: text,
	});

	// return `https://translate.google.com/translate_a/single?${searchParams}`;
	return `https://translate.googleapis.com/translate_a/single?${searchParams}`;
};

function genTranslatedObject(source: Messages, translatedArray: string[]) {
	const clonedSource = structuredClone(source);
	const sourceKeys = Object.keys(clonedSource);

	if (sourceKeys.length !== translatedArray.length) {
		throw Error('Origin and translated object length is not equal!');
	}

	for (let i = 0; i < sourceKeys.length; i++) {
		const key = sourceKeys[i];
		let message = translatedArray[i].trim();

		if (key === 'app_name') {
			message = `Translater ${message}`;
			console.log(message);
		}

		if (['options_title', 'commands_open_translater'].includes(key)) {
			// $ APP_NAME $ -> $APP_NAME$
			message = message.replace(/\$\s*(\w+)\s*\$/g, (_match, p1) => `$${p1}$`);
			console.log(message);
		}

		clonedSource[key].message = message;
	}

	return clonedSource;
}

async function translateLocales(inputFile: string, locales: string[]) {
	const fileContent = await readFile(inputFile, 'utf-8');
	const source: Messages = JSON.parse(fileContent);
	source.app_name.message = source.app_name.message.slice(11); // delete "Translater "
	const messageArray = Object.values(source).map(value => value.message);

	const translationsByLocale = await Promise.all(
		locales.map(async locale => {
			const delimiter = '\n\n';
			const url = generateRequestURL({
				text: messageArray.join(delimiter),
				targetLang: locale,
			});
			const response = await fetch(url);
			const data: GoogleTranslate = await response.json();
			const translatedArray = data.sentences?.reduce((a, v) => (a += v.trans), '').split(delimiter);
			return {
				locale,
				translatedArray,
			};
		}),
	);

	await Promise.all(
		translationsByLocale.map(async ({ locale, translatedArray }) => {
			const translatedObject = genTranslatedObject(source, translatedArray);
			const directory = `public/_locales/${locale}/`;
			await mkdir(directory, { recursive: true });
			const fileName = `${directory}messages.json`;
			const fileContent = JSON.stringify(translatedObject, null, 4);
			await writeFile(fileName, fileContent);
			console.log(`Translation saved in ${fileName}`);
		}),
	);
}

const locales = [
	'am', 'ar', 'bg', 'bn', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'es_419', 'et', 'fa', 'fi',
	'fil', 'fr', 'gu', 'he', 'hi', 'hr', 'hu', 'id', 'it', 'ja', 'kn', 'ko', 'lt', 'lv', 'ml',
	'mr', 'ms', 'nl', 'no', 'pl', 'pt_BR', 'pt_PT', 'ro', 'ru', 'sk', 'sl', 'sr', 'sv', 'sw', 'ta',
	'te', 'th', 'tr', 'uk', 'vi', 'zh_CN', 'zh_TW',
];

translateLocales('public/_locales/en/messages.json', locales);
