<svelte:element
	this={'li'}
	bind:this={element}
	class={className}
	aria-selected={selected === true ? selected : undefined}
	onclick={onClick}
	onkeypress={onKeypress}
	role="option"
	tabindex={active ? 0 : -1}
	{...rest}
>
	{@render children(selected)}
</svelte:element>

<script lang="ts">
import type { Snippet } from 'svelte';
import { onMount, onDestroy } from 'svelte';
import { getListboxContext } from './context';

interface Props {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any
	class: string
	children: Snippet<[ selected: boolean ]>
}

let {
	value = $bindable(),
	class: className,
	children,
	...rest
}: Props = $props();

const store = getListboxContext();

let element = $state<HTMLLIElement>();

let selected = $derived(store.value === value);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setSelectValue = (value: any) => {
	store.select(value);
	store.listboxOpen = false;
	store.buttonRef?.focus({ preventScroll: true });
	store.activeOptionIndex = null;
};

const onClick = () => {
	setSelectValue(value);
};

const onKeypress = (e: KeyboardEvent) => {
	if (e.code === 'Space' || e.code === 'Enter') {
		setSelectValue(value);
	}
};

let active = $derived(store.activeOptionIndex !== null
	? store.optionsRef[store.activeOptionIndex] === element
	: false,
);

onMount(() => {
	if (element) {
		store.optionsRef.push(element);
	}
	if (selected && element) {
		store.activeOptionIndex = store.optionsRef.indexOf(element);
		element.focus({ preventScroll: true });
		element.scrollIntoView({ block: 'nearest' });
	}
});

onDestroy(() => {
	store.optionsRef = store.optionsRef.filter(i => i !== element);
});
</script>
