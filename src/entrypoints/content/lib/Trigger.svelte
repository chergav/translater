<div
	class="absolute z-999999999"
	use:triggerPosition
	in:fade={{ duration: DURATION_IN }}
>
	<button
		class={[
			'group relative flex items-center justify-center rounded-lg p-1 shadow-md transition-colors ease-effects-fast',
			'bg-color-surface-container text-color-on-surface-variant hover:text-color-on-surface',
		]}
		aria-label={browser.i18n.getMessage('tooltip_translate_text')}
		onclick={store.openPopup}
		title={browser.i18n.getMessage('tooltip_translate_text')}
		type="button"
	>
		<span
			class={[
				'pointer-events-none absolute inset-0 rounded-[inherit] bg-color-on-surface opacity-0 transition-opacity ease-effects-fast',
				'group-hover:opacity-hover group-focus-visible:opacity-pressed group-active:opacity-pressed group-disabled:opacity-disabled',
			]}
		></span>
		<Icon d={customTranslatePath} size="22" />
	</button>
</div>

<script lang="ts">
import type { Action } from 'svelte/action';
import { fade } from 'svelte/transition';
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/content/store.svelte';
import { computePosition, offset, flip, type VirtualElement } from '@floating-ui/dom';
import Icon from '~/lib/Icon.svelte';
import { customTranslatePath } from '~/assets/icons/customTranslatePath';

const DURATION_IN = $derived<number>(storage.motionDisabled ? 0 : 150);
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
</script>
