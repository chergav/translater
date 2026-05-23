import type { MenuColor } from '../types';
import { createContext } from 'svelte';

interface ListboxCtx {
	value: unknown
	open: boolean
	openListbox: () => void
	toggle: () => void
	close: () => void
	color?: MenuColor
	triggerRef?: HTMLElement | null
}

export const [getListboxCtx, setListboxCtx] = createContext<ListboxCtx>();
