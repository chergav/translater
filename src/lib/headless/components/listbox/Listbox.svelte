<svelte:element
	this={tag}
	on:click_outside={() => {
		$store.listboxOpen = false;
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
import { writable } from 'svelte/store';
import { clickOutside } from '../../utils/click-outside';

export let value;

let tag = 'div';
const dispatch = createEventDispatcher();

const store = writable({
	listboxOpen: false,
	activeOptionIndex: null,
	buttonRef: null,
	optionsRef: [],
	value,
	select(newValue) {
		value = newValue;
		dispatch('change');
	}
});

$: $store.value = value;

setContext(LISTBOX_CONTEXT_NAME, store);
</script>
