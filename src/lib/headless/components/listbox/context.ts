/* eslint-disable @typescript-eslint/no-explicit-any */
import { getContext, setContext } from 'svelte';

export interface IStore {
	listboxOpen: boolean
	activeOptionIndex: number | null,
	buttonRef: HTMLButtonElement | null,
	optionsRef: HTMLLIElement[],
	value: any
	select: (value: any) => void
}

const key = 'listbox-context';

export function setListboxContext(store: IStore) {
	setContext(key, store);
}

export function getListboxContext() {
	return getContext(key) as IStore;
}
