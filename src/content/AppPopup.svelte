<div class={$themeClass}>
	<div
		class="
			absolute
			z-[99999]
			flex
			flex-row
			overflow-hidden
			rounded-[6px]
			w-[550px]
			h-fit
			text-sm
			bg-white
			dark:bg-gray-800
			shadow-xl
			border
			border-gray-300
			dark:border-gray-700
			text-gray-900
			dark:text-white
			text-start
			{moving ? 'select-none' : 'select-auto'}
		"
		bind:this={tooltip}
		use:clickOutside
		on:click_outside={() => {
			destroyApp('popup');
		}}
		style="left: {left}px; top: {top}px;"
	>
		<div
			class="
				w-[16px]
				flex
				place-items-center
				box-content
				border-r
				bg-gray-100
				text-gray-900
				border-gray-300
				dark:bg-gray-800
				dark:text-white
				dark:border-gray-700
				{moving ? 'cursor-grabbing' : 'cursor-move'}
			"
			on:mousedown={dragStart}
			on:mouseup={dragEnd}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16px"
				height="16px"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M0 0h24v24H0V0z" fill="none" />
				<path
					d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2
					.9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9
					2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1
					0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
				/>
			</svg>
		</div>
		<div class="w-full">
			<Popup on:update={tooltipPosition} />
		</div>
	</div>
</div>

<svelte:window on:mousemove={dragMove} />

<script>
import { destroyApp } from './appsHandler';
import Popup from './lib/Popup.svelte';
import { computePosition, offset, flip, shift } from '@floating-ui/dom';
import { persistentStore, themeClass } from '@/common/store';
import { store } from './store';
import { clickOutside } from './clickOutside';

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
		strategy: 'absolute',
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

		if (left < 1) {
			left = 0;
		}
	}
};

const dragEnd = () => {
	moving = false;
	$store.selectedElemRect = null;
};
</script>
