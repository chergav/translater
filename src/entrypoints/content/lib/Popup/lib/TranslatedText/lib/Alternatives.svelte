<div
	bind:this={portal}
	class="
		fixed
		max-h-96
		py-1
		flex
		flex-col
		bg-white
		dark:bg-gray-950
		text-sm
		rounded-lg
		border
		border-gray-100
		dark:border-gray-800
		divide-y-[1px]
		divide-gray-100
		dark:divide-gray-800
		shadow
		overflow-y-auto
		scrollbar
	"
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
				{text === alt ? 'bg-purple-900/10 dark:bg-purple-100/10' : 'hover:bg-gray-900/10 dark:hover:bg-gray-100/10'}
			"
			onclick={() => setAlt(alt)}
			type="button"
		>
			<Icon class="{text === alt ? 'visible' : 'invisible'} text-purple-900 dark:text-purple-100 shrink-0" d={mdiCheck} size="18" />
			<span class="text-start">{alt}</span>
		</button>
	{/each}
</div>

<script lang="ts">
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
