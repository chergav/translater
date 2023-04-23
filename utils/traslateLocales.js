import { mkdir, readFile, writeFile } from 'node:fs/promises';
import fetch from 'node-fetch';

const generateRequestURL = ({ sourceLang = 'en', targetLang = 'auto', text = '' } = {}) => {
	const searchParams = new URLSearchParams({
		client: 'gtx',
		sl: sourceLang,
		tl: targetLang,
		ie: 'UTF-8',
		oe: 'UTF-8',
		dj: '1',
		dt: 't',
		q: text
	});

	return `https://translate.google.com/translate_a/single?${searchParams}`;
};

const genTranslatedObject = (origObject, translatedArray) => {
	const clonedObject = structuredClone(origObject);
	const objectKeys = Object.keys(clonedObject);

	if (objectKeys.length !== translatedArray.length) {
		throw Error('Origin and translated object length is not equal!');
	}

	for (let i = 0; i < objectKeys.length; i++) {
		const key = objectKeys[i];
		clonedObject[key].message = translatedArray[i].trim();
	}

	return clonedObject;
};

const translateFile = async (inputFile, locales) => {
	const fileContent = await readFile(inputFile, 'utf-8');
	const origObject = JSON.parse(fileContent);
	const messageArray = Object.values(origObject).map(value => value.message);

	const translationsByLocale = await Promise.all(
		locales.map(async locale => {
			const response = await fetch(
				generateRequestURL({ text: messageArray.join(' @ '), targetLang: locale })
			);
			const data = await response.json();
			const translatedArray = data.sentences?.reduce((a, v) => (a += v.trans), '').split('@');
			return { locale, translatedArray };
		})
	);

	await Promise.all(
		translationsByLocale.map(async ({ locale, translatedArray }) => {
			const translatedObject = genTranslatedObject(origObject, translatedArray);
			const directory = `public/_locales/${locale}/`;
			await mkdir(directory, { recursive: true });
			const fileName = `${directory}messages.json`;
			const fileContent = JSON.stringify(translatedObject, null, 4);
			await writeFile(fileName, fileContent);
			console.log(`Translation saved to ${fileName}`);
		})
	);
};

const locales = [
	// 'ar',
	'de',
	// 'el',
	'es',
	// 'et',
	// 'fa',
	// 'fi',
	'fr',
	// 'he',
	'it',
	'ja',
	'ko',
	'nl',
	// 'no',
	'pl',
	'pt_BR',
	'pt_PT',
	'ru',
	// 'sv',
	// 'tr',
	'uk',
	'zh_CN',
	'zh_TW'
];
// const locales = ['ru'];

translateFile('public/_locales/en/messages.json', locales);
