{#if $store.listboxOpen}
	<svelte:element
		this={tag}
		role="listbox"
		tabindex="0"
		{...$$restProps}
		on:keydown={onKeyDown}
		transition:fly={{ duration: 150, y: -10 }}
	>
		<slot />
	</svelte:element>
{/if}

<script>
import { fly } from 'svelte/transition';
import { useListboxContext } from './Listbox.svelte';
import { getNextIndex } from '../../utils/get-next-index';
import { Keys, Focus } from '../../utils/enums';

let tag = 'ul';

const store = useListboxContext();

const setActiveOption = index => {
	$store.optionsRef[index].focus({ preventScroll: true });
	$store.optionsRef[index].scrollIntoView({ block: 'nearest' });
};

const goToOption = action => {
	const nextOptionIndex = getNextIndex({
		action,
		items: $store.optionsRef,
		currentActiveIndex: $store.activeOptionIndex
	});

	setActiveOption(nextOptionIndex);
	$store.activeOptionIndex = nextOptionIndex;
};

const onKeyDown = e => {
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
		$store.listboxOpen = false;
		$store.buttonRef.focus({ preventScroll: true });
		$store.activeOptionIndex = null;
		break;
	case Keys.Tab:
		e.preventDefault();
		e.stopPropagation();
		break;
	}
};
</script>
