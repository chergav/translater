import { writable, derived } from 'svelte/store';
import { storageSet, getSettings, storageListener } from '@/common/browserApi';

const initialPersistentData = {
	targetLang: await getSettings('targetLang'),
	theme: await getSettings('theme'),
	inlineButtonShow: await getSettings('inlineButtonShow')
};

const createPersistentStore = () => {
	const { subscribe, set, update } = writable(initialPersistentData);

	return {
		subscribe,
		set: value => {
			storageSet(value);
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

storageListener(changes => {
	for (const key in changes) {
		persistentStore.update(value => ({
			...value,
			[key]: changes[key].newValue
		}));
	}
});

export { persistentStore, themeClass };
