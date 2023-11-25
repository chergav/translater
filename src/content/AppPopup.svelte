<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	class={$themeClass}
	role="dialog"
	on:keypress|stopPropagation
	on:keydown|stopPropagation
	on:keyup|stopPropagation
>
	<div
		bind:this={tooltip}
		style="left: {left}px; top: {top}px;"
		class="
			fixed
			w-[550px]
			h-fit
			p-1
			flex
			flex-row
			text-sm
			text-gray-800
			dark:text-gray-200
			text-start
			bg-gray-100
			dark:bg-gray-950
			rounded-[18px]
			shadow-xl
			z-[9999999]
			{moving ? 'select-none' : 'select-auto'}
		"
		on:click_outside={() => {
			if (!$persistentStore.lockWindow) destroyApp('popup');
		}}
		use:clickOutside
	>
		<div class="w-full">
			<header
				class="
					mb-1
					flex
					justify-between
					leading-[0]
					{moving ? 'cursor-grabbing' : 'cursor-move'}
				"
				role="toolbar"
				tabindex="-1"
				on:mousedown|self={dragStart}
			>
				<PopupHeader />
			</header>
			<PopupMain />
			<PopupFooter />
		</div>
	</div>
</div>

<svelte:window on:mousemove={dragMove} on:mouseup={dragEnd} />

<script>
import { onMount, onDestroy } from 'svelte';
import { destroyApp } from './utils/appsHandler';
import PopupHeader from './lib/PopupHeader.svelte';
import PopupMain from './lib/PopupMain.svelte';
import PopupFooter from '~/content/lib/PopupFooter.svelte';
import { computePosition, offset, flip, shift } from '@floating-ui/dom';
import { persistentStore, themeClass } from '~/common/store';
import { store } from './store';
import { clickOutside } from '~/lib/utils/clickOutside';

const reference = {
	getBoundingClientRect: () => $store.selectedElemRect
};

let tooltip,
	left = 0,
	top = 0,
	moving = false;

const tooltipPosition = () => {
	if (!$store.selectedElemRect) {
		return;
	}

	// offset when open from context menu without inline button
	const bottomOffset = $store.isInTextField
		? $persistentStore.textFieldButtonShow
			? 31
			: 10
		: $persistentStore.inlineButtonShow
			? 31
			: 10;

	computePosition(reference, tooltip, {
		// strategy: 'absolute',
		strategy: 'fixed',
		placement: 'bottom-start',
		middleware: [
			offset(({ rects, placement }) =>
				placement === 'bottom-start'
					? rects.floating.y + bottomOffset
					: rects.floating.y + 10
			),
			flip({ flipAlignment: false }),
			shift({ padding: 10 })
		]
	}).then(({ x, y }) => {
		// fix position in large text fields
		const { innerWidth, innerHeight } = window;
		if (x < 0 || x > innerWidth) x = 10;
		if (y < 0 || y > innerHeight) y = 10;
		left = x;
		top = y;
	});
};

const dragStart = event => {
	const isLeftClick = event.button === 0;

	if (!isLeftClick) {
		return;
	}

	moving = true;
};

const dragMove = event => {
	if (moving) {
		left += event.movementX;
		top += event.movementY;

		if (top < 1) top = 0;
	}
};

const dragEnd = () => {
	moving = false;
	$store.selectedElemRect = null;
};

onMount(() => {
	tooltipPosition();
});

onDestroy(() => {
	$store.translated = null;
});
</script>
