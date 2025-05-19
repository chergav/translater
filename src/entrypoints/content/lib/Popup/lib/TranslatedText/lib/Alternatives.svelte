<div
	bind:this={portal}
	class="
		fixed
		max-h-96
		py-1
		flex
		flex-col
		bg-surface
		text-sm
		rounded-lg
		border
		border-variant-200-800
		shadow
		overflow-y-auto
		scrollbar
	"
	transition:fly={{
		duration: 150,
		y: 10,
	}}
>
	{#each alternatives as alt, i (i)}
		<button
			class="
				pl-3
				pr-4
				py-2
				max-w-xl
				flex
				items-center
				gap-2
				cursor-pointer
				border-b
				border-variant-200-800
				last:border-none
				{text === alt ? 'bg-accent-primary/10' : 'hover:bg-accent-primary/5'}
			"
			onclick={() => setAlt(alt)}
			type="button"
		>
			<span class="size-[18px] inline-flex">
				<Icon class="{text === alt ? 'inline-flex' : 'hidden'} text-accent shrink-0" d={mdiCheck} size="18" />
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
	onChangeAlt: () => void
	portal?: HTMLDivElement
}

let {
	rect,
	text = $bindable(),
	alternatives,
	onChangeAlt,
	portal = $bindable(),
}: Props = $props();

function setAlt(alt: string) {
	text = alt;
	onChangeAlt();
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
