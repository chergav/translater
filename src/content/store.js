import { writable } from 'svelte/store';

const initData = {
	voices: null
};

export const store = writable(initData);
