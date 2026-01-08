<!-- eslint-disable-next-line svelte/valid-compile -->
<svelte:element
	this={as}
	bind:this={store.buttonRef}
	class={className}
	aria-haspopup="listbox"
	{...attrs}
	{...rest}
	onclick={onClick}
	onkeydown={onKeyDown}
>
	{@render children()}
</svelte:element>

<script lang="ts">
import type { Snippet } from 'svelte';
import type { ClassValue, HTMLButtonAttributes } from 'svelte/elements';
import { tick } from 'svelte';
import { getListboxContext } from './context';
import { getNextIndex } from '../../utils/get-next-index';
import { Keys, Focus } from '../../utils/enums';

interface Props extends HTMLButtonAttributes {
	class?: ClassValue
	as?: string
	children: Snippet
}

let {
	class: className,
	as = 'button',
	children,
	...rest
}: Props = $props();

let attrs = $derived({
	tabindex: as === 'button' ? 0 : -1,
	type: as === 'button' ? 'button' : undefined,
});

const store = getListboxContext();

const onClick = () => {
	store.listboxOpen = !store.listboxOpen;
};

const setActiveOption = (index: number) => {
	store.optionsRef[index].focus({ preventScroll: true });
	store.optionsRef[index].scrollIntoView({ block: 'nearest' });
};

const goToOption = (action: Focus) => {
	const nextOptionIndex = getNextIndex({
		action,
		items: store.optionsRef,
		currentActiveIndex: store.activeOptionIndex,
	});

	if (nextOptionIndex) setActiveOption(nextOptionIndex);
	store.activeOptionIndex = nextOptionIndex;
};

const onKeyDown = async (e: KeyboardEvent) => {
	switch (e.code) {
		case Keys.Space:
		case Keys.Enter:
		case Keys.ArrowDown:
			e.preventDefault();
			e.stopPropagation();
			store.listboxOpen = true;
			await tick();
			if (!store.value) {
				goToOption(Focus.First);
			}
			break;

		case Keys.ArrowUp:
			e.preventDefault();
			e.stopPropagation();
			store.listboxOpen = true;
			await tick();
			if (!store.value) {
				goToOption(Focus.Last);
			}
			break;
	}
};
</script>
