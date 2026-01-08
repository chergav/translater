import { Settings } from '~/types';
import { detectLanguage } from '~/entrypoints/background/utils/detectLanguage';
import { generateUniqueEmail } from '~/entrypoints/background/utils/generateUniqueEmail';

interface MyMemoryResponse {
	responseData: {
		translatedText: string;
		match: number;
	};
	quotaFinished: boolean;
	responseStatus: number;
	matches: Array<{
		translation: string;
		source: string;
		quality: string;
	}>;
}

async function getUserEmail(): Promise<string> {
	const result = await browser.storage.local.get<Settings>(['fakeUserEmail']);
	const fakeUserEmail = result.fakeUserEmail || generateUniqueEmail();

	if (!result.fakeUserEmail) {
		browser.storage.local.set<Settings>({ fakeUserEmail });
	}

	return fakeUserEmail;
}

export async function translateWithMyMemory(
	text: string,
	targetLang: string,
	signal: AbortSignal,
): Promise<string> {
	const sourceLang = await detectLanguage(text);
	const userEmail = await getUserEmail();

	const url = new URL('https://api.mymemory.translated.net/get');
	url.searchParams.append('q', text);
	url.searchParams.append('de', userEmail);
	url.searchParams.append('mt', '1');
	url.searchParams.append('langpair', `${sourceLang}|${targetLang}`);

	const response = await fetch(url.toString(), {
		method: 'GET',
		signal,
	});

	if (!response.ok) {
		throw new Error(`MyMemory API error: ${response.status} ${response.statusText}`);
	}

	const data: MyMemoryResponse = await response.json();

	if (data.responseStatus !== 200) {
		throw new Error(`MyMemory error: ${data.responseStatus}`);
	}

	if (data.quotaFinished) {
		throw new Error('MyMemory daily quota exceeded');
	}

	return data.responseData.translatedText;
}
