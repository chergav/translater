{#if segment.alternatives.length}
	<span
		onclick={openAlts}
		onclickoutside={closeAlts}
		onkeypress={() => {}}
		onmouseenter={highlightOrigText}
		onmouseleave={highlightOrigTextOff}
		role="button"
		tabindex="0"
		use:clickOutside={actionParams}
	>
		<span
			class={[
				'cursor-pointer rounded-xs hover:bg-color-primary/15',
				altsOpen && 'bg-color-primary/15',
			]}
		>{segmentText}</span>
	</span>
	{#if altsOpen}
		<Alternatives
			alternatives={segment.alternatives}
			{rect}
			bind:altsOpen
			bind:text={segmentText}
			bind:portal={actionParams.exclude}
		/>
	{/if}
{:else}
	<span>{segment.text}</span>
{/if}

<script lang="ts">
import type { TransSegment } from '~/types';

import Alternatives from './Alternatives.svelte';
import { type ActionParams, clickOutside } from '~/utils';
import { store } from '~/entrypoints/content/store.svelte';

interface Props  {
	segment: TransSegment
}

let { segment }: Props = $props();
let segmentText: string = $derived(segment.text);
let altsOpen: boolean = $state(false);
let rect: DOMRect = $state(new DOMRect());
let actionParams = $state<ActionParams<HTMLDivElement>>({ exclude: undefined });

function openAlts(event: Event) {
	if (!altsOpen) {
		const target = event.currentTarget as HTMLSpanElement;
		rect = target.getBoundingClientRect();
	}
	altsOpen = !altsOpen;
}

function closeAlts() {
	altsOpen = false;
}

function highlightOrigText() {
	store.textToHighlight = segment.rawSegment;
}

function highlightOrigTextOff() {
	store.textToHighlight = '';
}
</script>
