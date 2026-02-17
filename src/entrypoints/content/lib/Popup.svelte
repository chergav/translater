<div
	style="left: {left}px; top: {top}px;"
	class={[
		'fixed z-9999999 flex h-fit rounded-[18px]',
		'bg-color-surface-container text-start text-sm text-color-on-surface shadow-xl',
		isFullMode ? 'w-xl' : 'w-fit max-w-sm min-w-64',
		popupStore.dragging ? 'select-none' : 'select-auto',
		POPUP_CLASS,
	]}
	onclickoutside={onClickOutside}
	use:clickOutside
	use:popupPosition
	in:fade={{ duration: 150 }}
>
	<div class="flex w-full flex-col">
		<header
			class={[
				'flex w-full items-center justify-between p-1',
				popupStore.dragging ? 'cursor-grabbing' : 'cursor-move',
			]}
			onmousedown={onDragStart}
			role="toolbar"
			tabindex="-1"
		>
			<div class="flex items-center gap-1">
				<CacheNav />
				{#if isFullMode}
					<SelectModel/>
				{/if}
			</div>
			<div class="flex items-center gap-1">
				{#if isFullMode}
					<Menu />
				{:else}
					<Button
						icon={mdiSwapHorizontal}
						onclick={switchToFullMode}
						size="xs"
						title={browser.i18n.getMessage('popup_menu_switch_to_full_mode')}
					/>
				{/if}

				<Button
					icon={mdiClose}
					onclick={closePopup}
					size="xs"
					title="Close"
				/>
			</div>
		</header>

		{#if isFullMode}
			<PopupFull />
		{:else}
			<PopupSimple />
		{/if}
	</div>
</div>

<script lang="ts">
import type { Action } from 'svelte/action';
import { PopupMode } from '~/types';
import { onDestroy } from 'svelte';
import { fade } from 'svelte/transition';
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/content/store.svelte';
import { popupStore } from '~/entrypoints/content/lib/popupStore.svelte';
import Button from '~/lib/Button.svelte';
import Menu from './PopupFull/lib/Menu.svelte';
import CacheNav from './PopupFull/lib/CacheNav.svelte';
import SelectModel from './PopupFull/lib/SelectModel.svelte';
import PopupFull from './PopupFull/PopupFull.svelte';
import PopupSimple from './PopupSimple/PopupSimple.svelte';
import { computePosition, offset, flip, shift, type VirtualElement } from '@floating-ui/dom';
import { clickOutside } from '~/utils';
import { POPUP_CLASS } from '~/shared/constants';
import { mdiClose, mdiSwapHorizontal } from '@mdi/js';

let left = $state<number>(20);
let top = $state<number>(20);
let prevX = $state<number | null>(null);
let prevY = $state<number | null>(null);
let reference = $derived<VirtualElement>({
	getBoundingClientRect: () => store.selectedElemRect || new DOMRect(20, 20, 0, 0),
});
const isFullMode = $derived<boolean>(storage.settings.popupMode === PopupMode.Full);

const popupPosition: Action<HTMLDivElement> = popup => {
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
	if (event.button !== 0 || event.target !== event.currentTarget) return;

	popupStore.dragging = true;

	window.addEventListener('mousemove', onDragMove);
	window.addEventListener('mouseup', () => {
		window.removeEventListener('mousemove', onDragMove);
		prevX = null;
		prevY = null;
		popupStore.dragging = false;
	}, { once: true });
}

function onDragMove(event: MouseEvent) {
	if (!popupStore.dragging) return;

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

function onClickOutside() {
	if (!storage.settings.lockWindow) {
		store.showPopup = false;
	}
}

function switchToFullMode() {
	storage.settings.popupMode = PopupMode.Full;
}

function closePopup() {
	store.showPopup = false;
}

onDestroy(() => {
	store.resetTranslateStore();
});
</script>
