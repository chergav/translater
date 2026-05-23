{#if segment.alternatives.length}
	<span
		class={[
			'cursor-pointer rounded-xs text-color-on-surface hover:bg-color-secondary-container hover:text-color-on-secondary-container',
			'transition-colors ease-effects-fast',
			'outline-color-secondary focus-visible:outline-common',
			altsOpen && 'bg-color-secondary-container text-color-on-secondary-container',
		]}
		onclick={openAlts}
		onclickoutside={closeAlts}
		onkeydown={onKeydownHandler}
		onmouseenter={highlightOrigText}
		onmouseleave={highlightOrigTextOff}
		role="button"
		tabindex="0"
		title="Show alternatives"
		use:clickOutside={actionParams}
	>
		{segmentText}
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

function onKeydownHandler(e: KeyboardEvent) {
	if (e.code === 'Space' || e.code === 'Enter') {
		e.preventDefault();
		openAlts(e);
	}
}
</script>
