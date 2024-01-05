import { mkdir, readFile, writeFile } from 'node:fs/promises';

const generateRequestURL = ({ sourceLang = 'en', targetLang = 'auto', text = '' } = {}) => {
	const searchParams = new URLSearchParams({
		// client: 'tw-ob',
		client: 'gtx',
		sl: sourceLang,
		tl: targetLang,
		ie: 'UTF-8',
		oe: 'UTF-8',
		dj: '1',
		dt: 't',
		q: text
	});

	// return `https://translate.google.com/translate_a/single?${searchParams}`;
	return `https://translate.googleapis.com/translate_a/single?${searchParams}`;
};

const genTranslatedObject = (origObject, translatedArray) => {
	const clonedObject = structuredClone(origObject);
	const objectKeys = Object.keys(clonedObject);

	if (objectKeys.length !== translatedArray.length) {
		throw Error('Origin and translated object length is not equal!');
	}

	for (let i = 0; i < objectKeys.length; i++) {
		const key = objectKeys[i];
		let message = translatedArray[i].trim();

		if (key === 'app_name') {
			message = `Translater ${message}`;
			console.log(message);
		}

		if (key === 'options_title' || key === 'commands_open_translater') {
			// $ APP_NAME $ -> $APP_NAME$
			message = message.replace(/\$\s*(\w+)\s*\$/g, (match, p1) => `$${p1}$`);
			console.log(message);
		}

		clonedObject[key].message = message;
	}

	return clonedObject;
};

const translateFile = async (inputFile, locales) => {
	const fileContent = await readFile(inputFile, 'utf-8');
	const origObject = JSON.parse(fileContent);
	origObject.app_name.message = origObject.app_name.message.slice(11); // delete "Translater "

	const messageArray = Object.values(origObject).map(value => value.message);

	const translationsByLocale = await Promise.all(
		locales.map(async locale => {
			const delimiter = '\n\n';
			const response = await fetch(
				generateRequestURL({ text: messageArray.join(delimiter), targetLang: locale })
			);
			const data = await response.json();
			const translatedArray = data.sentences?.reduce((a, v) => (a += v.trans), '').split(delimiter);
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

	origObject.app_name.message = `Translater ${origObject.app_name.message}`;
	await writeFile('public/_locales/en/messages.json', JSON.stringify(origObject, null, 4));
	console.log('EN locale restored');
};

const locales = [
	'am', 'ar', 'bg', 'bn', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'es_419', 'et', 'fa', 'fi',
	'fil', 'fr', 'gu', 'he', 'hi', 'hr', 'hu', 'id', 'it', 'ja', 'kn', 'ko', 'lt', 'lv', 'ml',
	'mr', 'ms', 'nl', 'no', 'pl', 'pt_BR', 'pt_PT', 'ro', 'ru', 'sk', 'sl', 'sr', 'sv', 'sw', 'ta',
	'te', 'th', 'tr', 'uk', 'vi', 'zh_CN', 'zh_TW'
];

translateFile('public/_locales/en/messages.json', locales);
