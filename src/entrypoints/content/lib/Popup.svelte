<div
	style:left="{popupLeft}px"
	style:top="{popupTop}px"
	style:width="{popupWidth}px"
	style:transform="translate({moveDx}px, {moveDy}px)"
	class={[
		'fixed z-999999999 flex size-fit max-h-[calc(100vh-16px)] min-h-0 flex-col',
		popupStore.dragging || popupStore.resizing && 'select-none',
	]}
	{@attach resize({
		handleElem: handleElem!,
		margin: 10,
		minWidth: popupMinWidth,
		minHeight: popupMinHeight,
		cursorContainer: CUSTOM_ELEMENT_TAG,
		onStart: () => {
			popupStore.resizing = true;
		},
		onEnd: e => {
			popupLeft = e.x;
			popupTop = e.y;
			popupWidth = e.width;
			popupStore.resizing = false;
		},
	})}
	onclickoutside={onClickOutside}
	use:clickOutside
	use:popupPosition
	in:fade={{
		duration: DURATION_IN,
		easing: effectsSlow,
	}}
>
	<div
		bind:this={handleElem}
		class="flex size-full min-h-0 p-1.5"
	>
		<div
			class={[
				'flex min-h-0 w-full flex-col rounded-xl bg-color-surface-container transition-shadow ease-effects-fast',
				popupStore.dragging ? 'shadow-lg' : 'shadow-md',
			]}
		>
			<header
				class="flex shrink-0 items-center justify-between gap-1 p-1"
				{@attach drag({
					onStart: () => {
						popupStore.dragging = true;
					},
					onMove: e => {
						moveDx = e.dx;
						moveDy = e.dy;
					},
					onEnd: e => {
						popupLeft += e.dx;
						popupTop += e.dy;
						moveDx = 0;
						moveDy = 0;
						popupStore.dragging = false;
					},
				})}
			>
				<div class="flex items-center gap-1">
					<CacheNav />
					{#if isFullMode}
						<SelectModel />
					{:else if storage.settings.simpleModeShowLangs}
						<SelectLanguage
							align="center"
							autoLang
							detectedLang={store.detectedLang}
							mode="simple"
							onchange={store.reTranslate}
							bind:value={storage.settings.sourceLang}
						/>
						<IconButton
							color="standard"
							disabled={!store.detectedLang}
							onclick={handleReverseTranslate}
							size="xs"
							title={browser.i18n.getMessage('popup_menu_reverse_translate')}
						>
							<SwapHoriz />
						</IconButton>
						<SelectLanguage
							align="center"
							mode="simple"
							onchange={store.reTranslate}
							bind:value={storage.settings.targetLang}
						/>
					{/if}
				</div>
				<div class="flex items-center gap-1">
					{#if isFullMode}
						<Menu />
					{:else}
						<IconButton
							color="standard"
							onclick={switchToFullMode}
							size="xs"
							title={browser.i18n.getMessage('popup_menu_switch_to_full_mode')}
						>
							<ModeFull />
						</IconButton>
					{/if}

					<IconButton
						color="standard"
						onclick={closePopup}
						size="xs"
						title="Close"
					>
						<Close />
					</IconButton>
				</div>
			</header>

			{#if isFullMode}
				<PopupFull />
			{:else}
				<PopupSimple />
			{/if}
		</div>
	</div>
	{#if isFullMode}
		<PopupFooter />
	{/if}
</div>

<script lang="ts">
import type { Action } from 'svelte/action';
import { PopupMode } from '~/types';
import { onDestroy } from 'svelte';
import { fade } from 'svelte/transition';
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/content/store.svelte';
import { popupStore } from '~/entrypoints/content/lib/popupStore.svelte';
import IconButton from '~/lib/base/IconButton.svelte';
import { effectsSlow } from '~/lib/base/utils/md3Easing';
import Menu from './PopupFull/lib/Menu.svelte';
import CacheNav from './PopupFull/lib/CacheNav.svelte';
import SelectModel from './PopupFull/lib/SelectModel.svelte';
import PopupFull from './PopupFull/PopupFull.svelte';
import PopupSimple from './PopupSimple/PopupSimple.svelte';
import PopupFooter from './PopupFull/lib/PopupFooter/PopupFooter.svelte';
import SelectLanguage from '~/lib/SelectLanguage/SelectLanguage.svelte';
import { type VirtualElement, computePosition, flip, shift, offset } from '@floating-ui/dom';
import { clickOutside } from '~/utils';
import { drag } from '~/entrypoints/content/utils/drag';
import { resize } from '~/entrypoints/content/utils/resize';
import { CUSTOM_ELEMENT_TAG } from '~/shared/constants';
import Close from '~icons/material-symbols/close-rounded';
import ModeFull from '~icons/material-symbols/open-in-full-rounded';
import SwapHoriz from '~icons/material-symbols/swap-horiz-rounded';

let popupLeft = $state<number>(20);
let popupTop = $state<number>(20);
let moveDx = $state(0);
let moveDy = $state(0);
let handleElem = $state<HTMLDivElement | null>(null);
let reference = $derived<VirtualElement>({
	getBoundingClientRect: () => store.selectedElemRect || new DOMRect(20, 20, 0, 0),
});
const DURATION_IN = $derived<number>(storage.motionDisabled ? 0 : 300);
const isFullMode = $derived<boolean>(storage.settings.popupMode === PopupMode.Full);
let popupWidth = $derived<number>(isFullMode ? 550 : storage.settings.simpleModeShowLangs ? 400 : 260);
const popupMinWidth = $derived<number>(isFullMode || storage.settings.simpleModeShowLangs ? 400 : 260);
const popupMinHeight = $derived<number>(isFullMode ? 250 : 100);

const popupPosition: Action<HTMLDivElement> = popup => {
	computePosition(reference, popup, {
		strategy: 'fixed',
		placement: 'bottom-start',
		middleware: [
			offset(-4),
			flip({ flipAlignment: false }),
			shift({ padding: 10 }),
		],
	}).then(({ x, y }) => {
		// fix position in large text fields
		const { innerWidth, innerHeight } = window;
		if (x < 0 || x > innerWidth) x = 10;
		if (y < 0 || y > innerHeight) y = 10;
		popupLeft = x;
		popupTop = y;
	});
};

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

function handleReverseTranslate() {
	store.reverseTranslation();
}

onDestroy(() => {
	store.resetTranslateStore();
});
</script>
