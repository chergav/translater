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
				'flex w-full items-center justify-between gap-1 p-1',
				popupStore.dragging ? 'cursor-grabbing' : 'cursor-move',
			]}
			onpointerdown={onDragStart}
			role="toolbar"
			tabindex="-1"
		>
			<div class="flex items-center gap-1">
				<CacheNav />
				{#if isFullMode}
					<SelectModel/>
				{:else}
					{#if storage.settings.simpleModeShowLangs}
						<div class="flex items-center gap-1">
							<SelectLanguage
								alignment="center"
								autoLang
								detectedLang={store.detectedLang}
								mode="simple"
								onchange={store.reTranslate}
								bind:value={storage.settings.sourceLang}
							/>
							<Button
								disabled={!store.detectedLang}
								icon={mdiSwapHorizontal}
								onclick={store.reverseTranslation}
								size="xs"
								title={browser.i18n.getMessage('popup_menu_reverse_translate')}
							/>
							<SelectLanguage
								alignment="center"
								markUILang
								mode="simple"
								onchange={store.reTranslate}
								bind:value={storage.settings.targetLang}
							/>
						</div>
					{/if}
				{/if}
			</div>
			<div class="flex items-center gap-1">
				{#if isFullMode}
					<Menu />
				{:else}
					<Button
						icon={mdiArrowExpand}
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
import SelectLanguage from '~/lib/SelectLanguage.svelte';
import { computePosition, offset, flip, shift, type VirtualElement } from '@floating-ui/dom';
import { clickOutside } from '~/utils';
import { POPUP_CLASS } from '~/shared/constants';
import { mdiClose, mdiArrowExpand, mdiSwapHorizontal } from '@mdi/js';

let left = $state<number>(20);
let top = $state<number>(20);
let prevX = $state<number | null>(null);
let prevY = $state<number | null>(null);
let reference = $derived<VirtualElement>({
	getBoundingClientRect: () => store.selectedElemRect || new DOMRect(20, 20, 0, 0),
});
const isFullMode = $derived<boolean>(storage.settings.popupMode === PopupMode.Full);

const DRAG_THRESHOLD = 5;

let dragStartX = $state<number | null>(null);
let dragStartY = $state<number | null>(null);
let dragInitialized = $state<boolean>(false);

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

function onDragStart(event: PointerEvent) {
	if (event.button !== 0) return;

	dragStartX = event.clientX;
	dragStartY = event.clientY;
	dragInitialized = false;

	window.addEventListener('pointermove', onDragMove);
	window.addEventListener('pointerup', onDragEnd, { once: true });
}

function onDragMove(event: PointerEvent) {
	if (dragStartX === null || dragStartY === null) return;

	if (!dragInitialized) {
		const dx = Math.abs(event.clientX - dragStartX);
		const dy = Math.abs(event.clientY - dragStartY);
		if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) return;
		dragInitialized = true;
		popupStore.dragging = true;
		prevX = event.clientX;
		prevY = event.clientY;
	}

	if (prevX === null || prevY === null) return;
	left += event.clientX - prevX;
	top += event.clientY - prevY;
	if (top < 0) top = 0;
	prevX = event.clientX;
	prevY = event.clientY;
}

function onDragEnd() {
	window.removeEventListener('pointermove', onDragMove);
	prevX = null;
	prevY = null;
	popupStore.dragging = false;

	if (dragInitialized) {
		// Block the click that fires right after pointerup
		window.addEventListener('click', e => e.stopPropagation(), {
			once: true,
			capture: true,
		});
	}
	dragInitialized = false;
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
