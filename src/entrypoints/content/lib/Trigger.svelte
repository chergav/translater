<div
	class="absolute z-[9999999]"
	use:triggerPosition
>
	<button
		class="
			p-0.5
			flex
			items-center
			justify-center
			bg-surface
			text-primary
			border
			border-variant-200-800
			rounded-lg
			shadow-lg
			cursor-pointer
		"
		onclick={openPopup}
		title={browser.i18n.getMessage('tooltip_translate_text')}
		type="button"
		transition:fade={{ duration: 100 }}
	>
		<Icon d={customTranslatePath} />
	</button>
</div>

<!-- <div
	class="absolute bg-red-500 z-[99999999]"
	style="
		width: {(store.selectedEndCoord?.width || 0) + 2}px;
		height: {store.selectedEndCoord?.height}px;
		top: {store.selectedEndCoord?.top}px;
		left: {store.selectedEndCoord?.left}px;
	"
></div> -->

<script lang="ts">
import type { Action } from 'svelte/action';
import { fade } from 'svelte/transition';
import { store } from '~/entrypoints/content/store.svelte';
import { computePosition, offset, flip, type VirtualElement } from '@floating-ui/dom';
import Icon from '~/lib/Icon.svelte';
import { customTranslatePath } from '~/assets/icons/customTranslatePath';

let reference = $derived<VirtualElement>({
	getBoundingClientRect: () => store.selectedEndCoord || new DOMRect(),
});

const triggerPosition: Action = trigger => {
	$effect(() => {
		if (!store.selectedEndCoord) {
			return;
		}

		computePosition(reference, trigger, {
			strategy: 'absolute',
			placement: 'bottom-end',
			middleware: [
				offset(({ rects }) => ({
					mainAxis: 4,
					alignmentAxis: -rects.floating.width,
				})),
				flip(),
			],
		}).then(({ x, y }) => {
			Object.assign(trigger.style, {
				left: `${x}px`,
				top: `${y}px`,
			});
		});
	});
};

function openPopup() {
	store.showPopup = true;
	store.textToTranslate = store.selectedText;
	store.getTranslate();
}
</script>
