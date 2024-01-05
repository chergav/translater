<svelte:element
	this={as}
	bind:this={element}
	role="menuitem"
	tabindex={active ? 0 : -1}
	on:click={onClick}
	on:keydown={onKeydown}
	on:keypress={onKeypress}
	{...$$restProps}
>
	<slot />
</svelte:element>

<script>
import { onMount, onDestroy, afterUpdate, tick } from 'svelte';
import { createEventDispatcher } from 'svelte';
import { useMenuContext } from './Menu.svelte';

export let as = 'a';
export let noclose = false;

let element;

const dispatch = createEventDispatcher();
const store = useMenuContext();

const onClick = e => {
	if (noclose) {
		e.stopPropagation();
	}
	dispatch('click');
};

const onKeydown = e => {
	if (e.code === 'Space' || e.code === 'Enter') {
		if (noclose) {
			e.stopPropagation();
		}
		dispatch('keydown');
	}
};

const onKeypress = e => {
	if (e.code === 'Space' || e.code === 'Enter') {
		if (noclose) {
			e.stopPropagation();
		}
		dispatch('keypress');
	}
};

$: active = $store.activeItemIndex !== null
	? $store.itemsRef[$store.activeItemIndex] === element
	: false;

onMount(() => {
	$store.itemsRef = [...$store.itemsRef, element];
});

afterUpdate(async () => {
	if ($store.menuOpen && active) {
		await tick();
		element.focus({ preventScroll: true });
		element.scrollIntoView({ block: 'nearest' });
	}
});

onDestroy(() => {
	$store.itemsRef = $store.itemsRef.filter(i => i !== element);
});
</script>
