<div class={$themeClass}>
	<div
		class="
			fixed
			w-[550px]
			h-fit
			p-1
			overflow-hidden
			flex
			flex-row
			text-sm
			text-gray-800
			dark:text-gray-200
			text-start
			bg-gray-100
			dark:bg-gray-950
			rounded-[16px]
			shadow-xl
			z-[9999999]
			{moving ? 'select-none' : 'select-auto'}
		"
		bind:this={tooltip}
		use:clickOutside
		on:click_outside={() => {
			if (!$persistentStore.lockWindow) destroyApp('popup');
		}}
		style="left: {left}px; top: {top}px;"
	>
		<div class="w-full">
			<header
				role="toolbar"
				tabindex="-1"
				class="
					mb-1
					flex
					justify-between
					leading-[0]
					{moving ? 'cursor-grabbing' : 'cursor-move'}
				"
				on:mousedown|self={dragStart}
			>
				<PopupNav />
			</header>
			<Popup on:update={tooltipPosition} />
		</div>
	</div>
</div>

<svelte:window on:mousemove={dragMove} on:mouseup={dragEnd} />

<script>
import { destroyApp } from './utils/appsHandler';
import PopupNav from './lib/PopupNav.svelte';
import Popup from './lib/Popup.svelte';
import { computePosition, offset, flip, shift } from '@floating-ui/dom';
import { persistentStore, themeClass } from '~/common/store';
import { store } from './store';
import { clickOutside } from '~/lib/utils/clickOutside';

const reference = {
	getBoundingClientRect: () => $store.selectedElemRect,
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
			shift({ padding: 10 }),
		],
	}).then(({ x, y }) => {
		// for fix position in large text fields
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
</script>
