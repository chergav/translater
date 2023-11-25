<svelte:element
	this={tag}
	on:click_outside={() => {
		$store.menuOpen = false;
	}}
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
import { clickOutside } from '../../utils/clickOutside';

let tag = 'div';

const store = writable({
	menuOpen: false
});

setContext(MENU_CONTEXT_NAME, store);
</script>
