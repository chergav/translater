{#if segment.alternatives.length}
	<span
		class="
			cursor-pointer
			hover:bg-purple-900/10
			dark:hover:bg-purple-100/10
			{altsOpen ? 'bg-purple-900/10 dark:bg-purple-100/10' : ''}
		"
		onclick={openAlts}
		onclickoutside={closeAlts}
		onkeypress={() => {}}
		role="button"
		tabindex="0"
		use:clickOutside={actionParams}
	>
		{segmentText}
		{#if altsOpen}
			<Alternatives
				alternatives={segment.alternatives}
				onChangeAlt={closeAlts}
				{rect}
				bind:text={segmentText}
				bind:portal={actionParams.exclude}
			/>
		{/if}
	</span>
{:else}
	<span>{segment.text}</span>
{/if}

<script lang="ts">
import type { TransSegment } from '~/shared/types';
import Alternatives from './Alternatives.svelte';
import { type ActionParams, clickOutside } from '~/utils';

interface Props  {
	segment: TransSegment
}

let { segment }: Props = $props();
let segmentText: string = $state(segment.text);
let altsOpen: boolean = $state(false);
let rect: DOMRect = $state(new DOMRect());
let actionParams = $state<ActionParams<HTMLDivElement>>({ exclude: undefined });

function openAlts(event: Event) {
	const target = event.currentTarget as HTMLSpanElement;
	rect = target.getBoundingClientRect();
	altsOpen = !altsOpen;
}

function closeAlts() {
	altsOpen = false;
}

$effect(() => {
	segmentText = segment.text;
});
</script>
