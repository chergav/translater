<div class={$themeClass}>
	<div
		id="trigger-contaner"
		class="
			absolute
			z-[99999]
			leading-[0]
			rounded-[12px]
			overflow-hidden
			my-class
		"
		bind:this={trigger}
	>
		{#if $persistentStore.inlineButtonShow}
			<TheTrigger />
		{/if}
	</div>
</div>

<script context="module">
import { loadFont } from '@/common/fontLoader';

loadFont();
</script>

<script>
import { onMount } from 'svelte';
import TheTrigger from './TheTrigger.svelte';
import { computePosition, offset } from '@floating-ui/dom';
import { getSelectedEndCoord } from './rects';
import { persistentStore, themeClass } from '@/common/store';

const reference = {
	getBoundingClientRect: () => getSelectedEndCoord(),
};

let trigger;

const triggerPosition = () => {
	computePosition(reference, trigger, {
		strategy: 'absolute',
		placement: 'bottom-end',
		middleware: [offset(({ rects }) => ({ mainAxis: 0, crossAxis: rects.floating.width / 2 }))],
	}).then(({ x, y }) => {
		Object.assign(trigger.style, {
			left: `${x}px`,
			top: `${y}px`,
		});
	});
};

onMount(() => {
	triggerPosition();
});
</script>
