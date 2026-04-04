interface CacheEntry<T> {
	value: T;
}

const CACHE_PREFIX = 'tr_';
const INDEX_KEY = `${CACHE_PREFIX}index`;
const MAX_ENTRIES = 1000;

// function hashKey(input: string): string {
// 	let hash = 5381;
// 	for (let i = 0; i < input.length; i++) {
// 		hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
// 		hash = hash >>> 0;
// 	}
// 	return hash.toString(36);
// }

function hashKey(input: string): string {
	let hi = 0x811c9dc5;
	let lo = 0x27c4a555;

	for (let i = 0; i < input.length; i++) {
		const c = input.charCodeAt(i);
		lo ^= c;
		lo = Math.imul(lo, 0x1000193) >>> 0;
		hi ^= c;
		hi = Math.imul(hi, 0x1000193) >>> 0;
	}

	return (hi >>> 0).toString(36) + (lo >>> 0).toString(36);
}

function buildKey(sourceText: string, sourceLang: string, targetLang: string, api: string): string {
	return CACHE_PREFIX + hashKey(`${sourceLang}|${targetLang}|${api}|${sourceText}`);
}

async function getIndex(): Promise<string[]> {
	try {
		const result = await browser.storage.session.get(INDEX_KEY);
		return (result[INDEX_KEY] as string[]) ?? [];
	} catch {
		return [];
	}
}

async function setIndex(keys: string[]): Promise<void> {
	await browser.storage.session.set({ [INDEX_KEY]: keys });
}

export async function clearCache(): Promise<void> {
	const keys = await getIndex();
	await browser.storage.session.remove([...keys, INDEX_KEY]);
}

export async function getCache<T>(
	sourceText: string,
	sourceLang: string,
	targetLang: string,
	api: string,
): Promise<T | null> {
	// console.debug('getCache', sourceText, sourceLang, targetLang, api);
	const key = buildKey(sourceText, sourceLang, targetLang, api);

	try {
		const result = await browser.storage.session.get(key);
		const entry = result[key] as CacheEntry<T> | undefined;

		return entry?.value
			? {
				...entry.value,
				cacheKey: key,
			}
			: null;
	} catch {
		return null;
	}
}

export async function getCacheByKey<T>(key: string): Promise<T | null> {
	try {
		const result = await browser.storage.session.get(key);
		const entry = result[key] as CacheEntry<T> | undefined;
		return entry?.value ?? null;
	} catch {
		return null;
	}
}

export async function setCache<T>(
	sourceWord: string,
	sourceLang: string,
	targetLang: string,
	api: string,
	value: T,
): Promise<string | undefined> {
	const key = buildKey(sourceWord, sourceLang, targetLang, api);
	const entry: CacheEntry<T> = {
		value,
	};
	const index = await getIndex();

	// Evict oldest 20% if over limit
	if (index.length >= MAX_ENTRIES && !index.includes(key)) {
		const toRemove = index.splice(0, Math.floor(MAX_ENTRIES * 0.2));
		await browser.storage.session.remove(toRemove);
	}

	const save = async (): Promise<boolean> => {
		try {
			await browser.storage.session.set({ [key]: entry });
			if (!index.includes(key)) {
				index.push(key);
				await setIndex(index);
			}
			return true;
		} catch (e) {
			if (e instanceof Error && e.message.toLowerCase().includes('quota')) {
				return false;
			}
			throw e;
		}
	};

	if (await save()) return key;

	// Quota hit — evict half and retry once
	const half = index.splice(0, Math.floor(index.length / 2));
	await browser.storage.session.remove(half);
	await setIndex(index);

	return (await save()) ? key : undefined;
}
