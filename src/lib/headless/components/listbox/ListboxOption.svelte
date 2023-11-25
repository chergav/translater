<svelte:element
	this={tag}
	bind:this={element}
	aria-selected={selected === true ? selected : undefined}
	role="option"
	tabindex="0"
	on:click={handleClick}
	on:keypress={handlekeypress}
	{...$$restProps}
>
	<slot {selected} />
</svelte:element>

<script>
import { onMount } from 'svelte';
import { useListboxContext } from './Listbox.svelte';

export let value;
export let focus = true;

let tag = 'li';
let element;

const store = useListboxContext();

$: selected = $store.value === value;

const setSelectValue = value => {
	$store.select(value);
	$store.value = value;
	$store.listboxOpen = false;
};

const handleClick = () => {
	setSelectValue(value);
};

const handlekeypress = e => {
	if (e.code === 'Space' || e.code === 'Enter') {
		setSelectValue(value);
	}
};

onMount(() => {
	if (selected && focus) {
		element.scrollIntoView({ block: 'end' });
	}
});
</script>
