{#if isTooltipShow}
<div class="{$themeClass}">
	<div
		class="
			absolute
			top-0
			left-0
			px-2
			py-1
			rounded-md
			text-sm
			border
			bg-white
			text-gray-900
			border-gray-300
			dark:bg-gray-900
			dark:text-white
			dark:border-gray-800
			z-[9999999]
		"
		use:tooltipPosition
		transition:fade
	>
		{title}
	</div>
</div>
{/if}

<script>
import { onMount } from 'svelte';
import { fade } from 'svelte/transition';
import { computePosition, offset, flip, shift } from '@floating-ui/dom';
import { themeClass } from '@/common/store';

export let title;
export let placement;
export let element;

let isTooltipShow = false;

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
	isTooltipShow = true;
});
</script>
