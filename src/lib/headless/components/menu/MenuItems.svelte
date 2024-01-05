{#if $store.menuOpen}
	<svelte:element
		this={tag}
		bind:this={$store.menuItemsRef}
		role="menu"
		tabindex="0"
		{...$$restProps}
		on:click={onClick}
		on:keydown={onKeyDown}
		transition:fly={{ duration: 150, y: -10 }}
	>
		<slot />
	</svelte:element>
{/if}

<script>
import { fly } from 'svelte/transition';
import { useMenuContext } from './Menu.svelte';
import { Keys, Focus } from '../../utils/enums';
import { getNextIndex } from '../../utils/get-next-index';

let tag = 'div';

const store = useMenuContext();

const onClick = () => {
	$store.menuOpen = false;
};

const goToItem = action => {
	const nextItemIndex = getNextIndex({
		action,
		items: $store.itemsRef,
		currentActiveIndex: $store.activeItemIndex
	});

	$store.activeItemIndex = nextItemIndex;
};

const onKeyDown = e => {
	switch (e.code) {
	case Keys.Enter:
	case Keys.Space:
		e.preventDefault();
		e.stopPropagation();
		$store.itemsRef[$store.activeItemIndex].click();
		$store.menuOpen = false;
		$store.buttonRef.focus({ preventScroll: true });
		break;
	case Keys.ArrowUp:
		e.preventDefault();
		e.stopPropagation();
		goToItem(Focus.Prev);
		break;
	case Keys.ArrowDown:
		e.preventDefault();
		e.stopPropagation();
		goToItem(Focus.Next);
		break;
	case Keys.PageUp:
	case Keys.Home:
		e.preventDefault();
		e.stopPropagation();
		goToItem(Focus.First);
		break;
	case Keys.End:
	case Keys.PageDown:
		e.preventDefault();
		e.stopPropagation();
		goToItem(Focus.Last);
		break;
	case Keys.Escape:
		e.preventDefault();
		e.stopPropagation();
		$store.menuOpen = false;
		$store.activeItemIndex = null;
		$store.buttonRef.focus({ preventScroll: true });
		break;
	case Keys.Tab:
		e.preventDefault();
		e.stopPropagation();
		break;
	}
};
</script>
