<svelte:element
	this={tag}
	on:click_outside={closeMenu}
	use:clickOutside
	{...$$restProps}
>
	<slot />
</svelte:element>

<script context="module">
const MENU_CONTEXT_NAME = 'menu-context';
export const useMenuContext = () => getContext(MENU_CONTEXT_NAME);
</script>

<script>
import { setContext, getContext } from 'svelte';
import { writable } from 'svelte/store';
import { clickOutside } from '../../utils/click-outside';

let tag = 'div';

const store = writable({
	menuOpen: false,
	activeItemIndex: null,
	buttonRef: null,
	menuItemsRef: null,
	itemsRef: []
});

const closeMenu = () => {
	$store.menuOpen = false;
	$store.activeItemIndex = null;
};

setContext(MENU_CONTEXT_NAME, store);
</script>
