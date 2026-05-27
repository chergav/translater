<div
	bind:this={portal}
	class={[
		'fixed z-9999999991 scrollbar flex max-h-96 flex-col gap-0.5 overflow-y-auto rounded-2xl p-1 text-sm',
		'bg-color-surface-container-low shadow-sm',
	]}
	use:portalAction
	transition:fly={{
		duration: DURATION,
		y: -10,
		easing: expressiveSpatialFast,
	}}
>
	{#each alternatives as alt, i (i)}
		<button
			class={[
				'flex max-w-xl min-w-32 cursor-pointer items-center gap-2 px-3 py-1.5 font-medium transition-colors',
				'first:rounded-t-xl last:rounded-b-xl',
				text === alt ?
					'rounded-xl bg-color-tertiary-container text-color-on-tertiary-container hover:bg-color-tertiary-container/92' :
					'rounded-sm text-color-on-surface hover:bg-color-on-surface/8',
			]}
			onclick={() => setAlt(alt)}
			type="button"
		>
			{#if text === alt}
				<Check class="inline-flex size-5 shrink-0" />
			{/if}
			<span class="text-start">{alt}</span>
		</button>
	{/each}
</div>

<script lang="ts">
import type { Action } from 'svelte/action';
import { fly } from 'svelte/transition';
import { storage } from '~/shared/storage.svelte';
import { CUSTOM_ELEMENT_TAG, ROOT_ELEM_CLASS } from '~/shared/constants';
import { expressiveSpatialFast } from '~/lib/base/utils/md3Easing';
import Check from '~icons/material-symbols/check-rounded';

interface Props {
	rect: DOMRect
	text: string
	alternatives: string[]
	altsOpen: boolean
	portal?: HTMLDivElement
}

let {
	rect,
	text = $bindable(),
	alternatives,
	altsOpen = $bindable(),
	portal = $bindable(),
}: Props = $props();

const DURATION = $derived<number>(storage.motionDisabled ? 0 : 350);

function setAlt(alt: string) {
	text = alt;
	altsOpen = false;
}

const portalAction: Action<HTMLDivElement> = node => {
	const root = document
		.querySelector(CUSTOM_ELEMENT_TAG)!
		.shadowRoot!
		.querySelector(`.${ROOT_ELEM_CLASS}`);

	if (root) {
		node.style.top = `${rect.bottom}px`;
		node.style.left = `${rect.left}px`;
		root.append(node);
	}

	$effect(() => {
		return () => {
			node.remove();
		};
	});
};
</script>
