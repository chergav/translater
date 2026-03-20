<label
	class={[
		'group flex cursor-pointer flex-col items-center overflow-hidden rounded-xl transition-all select-none',
		'border border-color-surface-high hover:border-color-surface-highest hover:shadow-sm has-checked:border-color-primary',
		'has-focus-visible:outline-custom has-focus-visible:outline-color-primary',
	]}
>
	<input class="peer sr-only" type="radio" {value} bind:group />
	<div class="pointer-events-none">
		{@render children?.()}
	</div>
	<div class="flex w-full items-center gap-2 px-4 py-2">
		<div
			class={[
				'flex size-5 shrink-0 items-center justify-center rounded-full',
				'border-2 border-color-outline bg-color-surface text-color-on-primary',
				'group-has-checked:border-color-primary group-has-checked:bg-color-primary',
			]}
		>
			<Icon class="invisible group-has-checked:visible" d={mdiCheck} size="18" />
		</div>
		<span class="text-sm">{label}</span>
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
