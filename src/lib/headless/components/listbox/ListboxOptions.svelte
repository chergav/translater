{#if store.listboxOpen}
	<svelte:element
		this={'li'}
		class={className}
		role="listbox"
		tabindex="0"
		{...rest}
		onkeydown={onKeyDown}
		transition:fly={{
			duration: 150,
			y: -10,
		}}
	>
		{@render children()}
	</svelte:element>
{/if}

<script lang="ts">
import type { Snippet } from 'svelte';
import type { ClassValue } from 'svelte/elements';
import { fly } from 'svelte/transition';
import { getListboxContext } from './context';
import { getNextIndex } from '../../utils/get-next-index';
import { Keys, Focus } from '../../utils/enums';

interface Props {
	class: ClassValue
	children: Snippet
}

let {
	class: className,
	children,
	...rest
}: Props = $props();

const store = getListboxContext();

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

const onKeyDown = (e: KeyboardEvent) => {
	switch (e.code) {
		case Keys.ArrowUp:
			e.preventDefault();
			e.stopPropagation();
			goToOption(Focus.Prev);
			break;
		case Keys.ArrowDown:
			e.preventDefault();
			e.stopPropagation();
			goToOption(Focus.Next);
			break;
		case Keys.PageUp:
		case Keys.Home:
			e.preventDefault();
			e.stopPropagation();
			goToOption(Focus.First);
			break;
		case Keys.End:
		case Keys.PageDown:
			e.preventDefault();
			e.stopPropagation();
			goToOption(Focus.Last);
			break;
		case Keys.Escape:
			e.preventDefault();
			e.stopPropagation();
			store.listboxOpen = false;
			store.buttonRef?.focus({ preventScroll: true });
			store.activeOptionIndex = null;
			break;
		case Keys.Tab:
			e.preventDefault();
			e.stopPropagation();
			break;
	}
};
</script>
