<svelte:element
	this={as}
	role="menuitem"
	tabindex="0"
	on:click={handleClick}
	on:keypress
	{...$$restProps}
>
	<slot />
</svelte:element>

<script>
import { createEventDispatcher } from 'svelte';

export let as = 'a';
export let noclose = false;

const dispatch = createEventDispatcher();

const handleClick = e => {
	if (noclose) {
		e.stopPropagation();
	}
	dispatch('click');
};
</script>
