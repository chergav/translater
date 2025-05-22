<label
	class="
		flex
		flex-col
		items-center
		cursor-pointer
		border
		border-variant-300-700
		hover:border-variant-400-600
		has-checked:border-accent-primary
		rounded-2xl
		overflow-hidden
		select-none
		transition-colors
	"
>
	<input class="sr-only peer" type="radio" {value} bind:group />
	<div class="pointer-events-none">
		{@render children?.()}
	</div>
	<div
		class="
			p-2
			w-full
			flex
			items-center
			gap-2
			bg-base
			border-t
			border-variant-300-700
			[&>div>svg]:invisible
			peer-checked:[&>div>svg]:visible
			[&>div]:bg-surface
			peer-checked:[&>div]:bg-accent-primary
			peer-checked:[&>div]:border-accent-primary
		"
	>
		<div
			class="
				size-6
				flex
				items-center
				justify-center
				shrink-0
				border-2
				border-variant-300-700
				text-primary-inverse
				rounded-full
				transition-colors
			"
		>
			<Icon d={mdiCheck} size="18" />
		</div>
		<span>{label}</span>
	</div>
</label>

<script lang="ts">
import type { Snippet } from 'svelte';
import Icon from '~/lib/Icon.svelte';
import { mdiCheck } from '@mdi/js';

interface Props {
	group: string
	value: string
	label: string
	children?: Snippet
}

let {
	group = $bindable(),
	value,
	label,
	children,
}: Props = $props();
</script>
