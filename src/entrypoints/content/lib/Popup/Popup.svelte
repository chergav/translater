<div
	style="left: {left}px; top: {top}px;"
	class={[
		'fixed z-[9999999] flex h-fit w-[550px] rounded-[18px]',
		'bg-color-surface-container text-start text-sm text-color-on-surface shadow-xl',
		dragging ? 'select-none' : 'select-auto',
		POPUP_CLASS,
	]}
	onclickoutside={onClickOutside}
	use:clickOutside
	use:popupPosition
	transition:fade={{ duration: 100 }}
>
	<div class="flex w-full flex-col">
		<header
			class={[
				'flex w-full items-center justify-between p-1',
				dragging ? 'cursor-grabbing' : 'cursor-move',
			]}
			onmousedown={onDragStart}
			role="toolbar"
			tabindex="-1"
		>
			<div class="flex items-center gap-1">
				<CacheNav />
			</div>
			<div class="flex items-center gap-1">
				<Menu />
				<Button icon={mdiClose} iconSize="20" onclick={closePopup} size="xs" />
			</div>
		</header>

		<PopupMain />

		<PopupFooter />
	</div>
</div>

<script lang="ts">
import type { Action } from 'svelte/action';
import { fade } from 'svelte/transition';
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/content/store.svelte';
import Button from '~/lib/Button.svelte';
import Menu from './lib/Menu.svelte';
import CacheNav from './lib/CacheNav.svelte';
import PopupMain from './lib/PopupMain.svelte';
import PopupFooter from './lib/PopupFooter/PopupFooter.svelte';
import { computePosition, offset, flip, shift, type VirtualElement } from '@floating-ui/dom';
import { mdiClose } from '@mdi/js';
import { clickOutside } from '~/utils';
import { POPUP_CLASS } from '~/shared/constants';

let left = $state<number>(20);
let top = $state<number>(20);
let dragging = $state<boolean>(false);
let prevX = $state<number | null>(null);
let prevY = $state<number | null>(null);
let reference = $derived<VirtualElement>({
	getBoundingClientRect: () => store.selectedElemRect || new DOMRect(20, 20, 0, 0),
});

const popupPosition: Action<HTMLDivElement> = popup => {
	if (!store.selectedElemRect) {
		return;
	}

	computePosition(reference, popup, {
		strategy: 'fixed',
		placement: 'bottom-start',
		middleware: [
			offset(4),
			flip({ flipAlignment: false }),
			shift({ padding: 10 }),
		],
	}).then(({ x, y }) => {
		// fix position in large text fields
		const { innerWidth, innerHeight } = window;
		if (x < 0 || x > innerWidth) x = 10;
		if (y < 0 || y > innerHeight) y = 10;
		left = x;
		top = y;
	});
};

function onDragStart(event: MouseEvent) {
	if (
		event.button !== 0 ||
		event.target !== event.currentTarget
	) return;

	dragging = true;

	window.addEventListener('mousemove', onDragMove);
	window.addEventListener('mouseup', () => {
		window.removeEventListener('mousemove', onDragMove);
		prevX = null;
		prevY = null;
		dragging = false;
	}, { once: true });
}

function onDragMove(event: MouseEvent) {
	if (!dragging) return;

	if (prevX === null || prevY === null) {
		prevX = event.clientX;
		prevY = event.clientY;
		return;
	}

	const deltaX = event.clientX - prevX;
	const deltaY = event.clientY - prevY;

	left += deltaX;
	top += deltaY;

	if (top < 1) top = 0;

	prevX = event.clientX;
	prevY = event.clientY;
}

function closePopup() {
	store.showPopup = false;
}

function onClickOutside() {
	if (!storage.settings.lockWindow) {
		store.showPopup = false;
	}
}

$effect(() => {
	return () => {
		store.resetTranslate();
	};
});
</script>
