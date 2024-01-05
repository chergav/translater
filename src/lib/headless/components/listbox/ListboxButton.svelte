<!-- eslint-disable-next-line svelte/valid-compile -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
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
import { useListboxContext } from './Listbox.svelte';
import { getNextIndex } from '../../utils/get-next-index';
import { Keys, Focus } from '../../utils/enums';

export let as = 'button';

let props = {
	tabindex: as === 'button' ? 0 : -1,
	type: as === 'button' ? 'button' : undefined
};

const store = useListboxContext();

const onClick = () => {
	$store.listboxOpen = !$store.listboxOpen;
};

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

const onKeyDown = async e => {
	switch (e.code) {
	case Keys.Space:
	case Keys.Enter:
	case Keys.ArrowDown:
		e.preventDefault();
		e.stopPropagation();
		$store.listboxOpen = true;
		await tick();
		if (!$store.value) {
			goToOption(Focus.First);
		}
		break;

	case Keys.ArrowUp:
		e.preventDefault();
		e.stopPropagation();
		$store.listboxOpen = true;
		await tick();
		if (!$store.value) {
			goToOption(Focus.Last);
		}
		break;
	}
};
</script>
