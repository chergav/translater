<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
	this={tag}
	on:click_outside={() => {
		$store.listboxOpen = false;
	}}
	on:keydown={e => {
		if (e.code === 'Escape') {
			$store.listboxOpen = false;
		}
	}}
	use:clickOutside
	{...$$restProps}
>
	<slot />
</svelte:element>

<script context="module">
const LISTBOX_CONTEXT_NAME = 'listbox-context';
export const useListboxContext = () => getContext(LISTBOX_CONTEXT_NAME);
</script>

<script>
import { setContext, getContext, createEventDispatcher } from 'svelte';
import { writable, derived } from 'svelte/store';
import { clickOutside } from '../../utils/clickOutside';

export let value;

let tag = 'div';
const dispatch = createEventDispatcher();

const store = writable({
	listboxOpen: false,
	value,
	select(newValue) {
		value = newValue;
		dispatch('change');
	}
});

const listboxOpen = derived(store, $store => $store.listboxOpen);

$: $store.value = value;

$: if (!$listboxOpen) {
	dispatch('listbox_closed');
}

setContext(LISTBOX_CONTEXT_NAME, store);
</script>
