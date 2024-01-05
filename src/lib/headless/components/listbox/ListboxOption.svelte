<svelte:element
	this={tag}
	bind:this={element}
	aria-selected={selected === true ? selected : undefined}
	role="option"
	tabindex={active ? 0 : -1}
	on:click={onClick}
	on:keypress={onKeypress}
	{...$$restProps}
>
	<slot {selected} />
</svelte:element>

<script>
import { onMount, onDestroy } from 'svelte';
import { useListboxContext } from './Listbox.svelte';

export let value;

let tag = 'li';
let element;

const store = useListboxContext();

$: selected = $store.value === value;

const setSelectValue = async value => {
	$store.select(value);
	$store.value = value;
	$store.listboxOpen = false;
	$store.buttonRef.focus({ preventScroll: true });
	$store.activeOptionIndex = null;
};

const onClick = () => {
	setSelectValue(value);
};

const onKeypress = e => {
	if (e.code === 'Space' || e.code === 'Enter') {
		setSelectValue(value);
	}
};

$: active = $store.activeOptionIndex !== null
	? $store.optionsRef[$store.activeOptionIndex] === element
	: false;

onMount(() => {
	$store.optionsRef = [...$store.optionsRef, element];
	if (selected) {
		$store.activeOptionIndex = $store.optionsRef.indexOf(element);
		element.focus({ preventScroll: true });
		element.scrollIntoView({ block: 'nearest' });
	}
});

onDestroy(() => {
	$store.optionsRef = $store.optionsRef.filter(i => i !== element);
});
</script>
