import { createContext } from 'svelte';

interface ListboxCtx {
	value: unknown
	open: boolean
	openListbox: () => void
	toggle: () => void
	close: () => void
	closeWithFocus: () => void
	focusFirstItem: () => void
	triggerRef?: HTMLElement | null
	searchRef?: HTMLInputElement | null
}

export const [getListboxCtx, setListboxCtx] = createContext<ListboxCtx>();
