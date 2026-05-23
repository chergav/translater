import { createContext } from 'svelte';

interface MenuCtx {
	close: () => void;
	color?: 'standard' | 'vibrant';
}

export const [getMenuCtx, setMenuCtx] = createContext<MenuCtx>();
