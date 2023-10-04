<div class={$themeClass}>
	<div
		class="
			absolute
			top-0
			left-0
			px-2
			py-1
			rounded-lg
			text-sm
			bg-gray-200
			text-gray-800
			dark:bg-gray-700
			dark:text-gray-200
			shadow-md
			z-[9999999]
		"
		bind:this={tooltipElement}
	>
		{@html title}
	</div>
</div>

<script>
import { onMount } from 'svelte';
import { computePosition, offset, flip, shift } from '@floating-ui/dom';
import { themeClass } from '~/common/store';

export let title;
export let placement;
export let element;

let tooltipElement;

// computePosition on title change
$: if (tooltipElement && title) tooltipPosition(tooltipElement);

const tooltipPosition = tooltip => {
	computePosition(element, tooltip, {
		placement,
		middleware: [offset(6), flip(), shift({ padding: 6 })],
	}).then(({ x, y }) => {
		Object.assign(tooltip.style, {
			left: `${x}px`,
			top: `${y}px`,
		});
	});
};

onMount(() => {
	tooltipPosition(tooltipElement);
});
</script>
