<!-- eslint-disable-next-line svelte/valid-compile -->
<svelte:element
	this={as}
	bind:this={$store.buttonRef}
	aria-haspopup="listbox"
	{...props}
	{...$$restProps}
	on:click={onClick}
	on:keydown={onKeyDown}
>
	<slot />
</svelte:element>

<script>
import { tick } from 'svelte';
import { useMenuContext } from './Menu.svelte';
import { getNextIndex } from '../../utils/get-next-index';
import { Keys, Focus } from '../../utils/enums';

export let as = 'button';

let props = {
	tabindex: as === 'button' ? 0 : -1,
	type: as === 'button' ? 'button' : undefined,
};

const store = useMenuContext();

const onClick = async () => {
	if ($store.menuOpen) {
		$store.menuOpen = false;
		$store.activeItemIndex = null;
		await tick();
		$store.buttonRef.focus({ preventScroll: true });
	} else {
		$store.menuOpen = true;
	}
};

const goToItem = action => {
	const nextItemIndex = getNextIndex({
		action,
		items: $store.itemsRef,
		currentActiveIndex: $store.activeItemIndex,
	});

	$store.activeItemIndex = nextItemIndex;
};

const onKeyDown = async e => {
	switch (e.code) {
		case Keys.Space:
		case Keys.Enter:
		case Keys.ArrowDown:
			e.preventDefault();
			e.stopPropagation();
			$store.menuOpen = true;
			await tick();
			goToItem(Focus.First);
			break;
		case Keys.ArrowUp:
			e.preventDefault();
			e.stopPropagation();
			$store.menuOpen = true;
			await tick();
			goToItem(Focus.Last);
			break;
	}
};
</script>
