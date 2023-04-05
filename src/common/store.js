import { writable, derived } from 'svelte/store';
import { storageGetAll, storageSet, storageListener } from '@/common/browserApi';
// import { defaultSettings } from '@/common/settings';

// console.log(await chrome.storage.local.get(defaultSettings));

// const initialPersistentData = {};
const initialPersistentData = await storageGetAll();

// for (const key in defaultSettings) {
// 	if (Object.hasOwn(defaultSettings, key)) {
// 		initialPersistentData[key] = await getSettings(key);
// 	}
// }

const createPersistentStore = () => {
	const { subscribe, set, update } = writable(initialPersistentData);

	return {
		subscribe,
		set: value => {
			storageSet(value);
			console.log(value);
			return set(value);
		},
		update
	};
};

const persistentStore = createPersistentStore();

const prefersColorScheme = () =>
	window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const themeClass = derived(persistentStore, $persistentStore =>
	$persistentStore.theme === 'system' ? prefersColorScheme() : $persistentStore.theme
);

// persistentStore.subscribe(value => {
// 	storageSet(value);
// 	console.log(value);
// });

storageListener(changes => {
	for (const key in changes) {
		persistentStore.update(value => ({
			...value,
			[key]: changes[key].newValue
		}));
	}
});

export { persistentStore, themeClass };
