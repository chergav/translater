<div
	bind:this={portal}
	class={[
		'fixed scrollbar flex max-h-96 flex-col overflow-y-auto rounded-lg py-1 text-sm shadow',
		'border border-color-surface-high bg-color-surface',
	]}

	transition:fly={{
		duration: 150,
		y: 10,
	}}
>
	{#each alternatives as alt, i (i)}
		<button
			class={[
				'flex max-w-xl cursor-pointer items-center gap-2 py-2 pr-4 pl-3',
				'border-b border-color-surface-high last:border-none',
				text === alt ? 'bg-color-primary/10' : 'hover:bg-color-primary/5',
			]}
			onclick={() => setAlt(alt)}
			type="button"
		>
			<span class="inline-flex size-5">
				<Icon class="{text === alt ? 'inline-flex' : 'hidden'} text-color-primary shrink-0" d={mdiCheck} size="20" />
			</span>
			<span class="text-start">{alt}</span>
		</button>
	{/each}
</div>

<script lang="ts">
import { fly } from 'svelte/transition';
import Icon from '~/lib/Icon.svelte';
import { mdiCheck } from '@mdi/js';
import { CUSTOM_ELEMENT_TAG, POPUP_CLASS } from '~/shared/constants';

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

function setAlt(alt: string) {
	text = alt;
	altsOpen = false;
}

$effect(() => {
	if (!portal) return;

	const root = document
		.querySelector(CUSTOM_ELEMENT_TAG)!
		.shadowRoot!
		.querySelector(`.${POPUP_CLASS}`);

	portal.style.top = `${rect.bottom}px`;
	portal.style.left = `${rect.left}px`;

	if (root) root.append(portal);
});
</script>
