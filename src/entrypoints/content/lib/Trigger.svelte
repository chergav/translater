<div
	class="absolute z-[9999999]"
	use:triggerPosition
>
	<button
		class={[
			'flex items-center justify-center rounded-lg p-0.5 shadow-lg',
			'border border-color-surface-high bg-color-surface text-color-on-surface',
		]}
		onclick={openPopup}
		title={browser.i18n.getMessage('tooltip_translate_text')}
		type="button"
		transition:fade={{ duration: 100 }}
	>
		<Icon d={customTranslatePath} />
	</button>
</div>

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
	store.translate();
}
</script>
