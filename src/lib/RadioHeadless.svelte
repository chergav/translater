<label
	class={[
		'group flex cursor-pointer flex-col items-center overflow-hidden rounded-2xl transition-colors select-none',
		'border border-color-surface-high hover:border-color-outline-variant has-checked:border-color-primary',
		'has-focus-visible:outline-custom has-focus-visible:outline-color-primary',
	]}
>
	<input class="peer sr-only" type="radio" {value} bind:group />
	<div class="pointer-events-none">
		{@render children?.()}
	</div>
	<div
		class={[
			'flex w-full items-center gap-2 p-2',
			'border-t border-color-surface-high bg-color-surface-container',
		]}
	>
		<div
			class={[
				'flex size-6 shrink-0 items-center justify-center rounded-full transition-colors',
				'border-2 border-color-outline bg-color-surface text-color-on-primary',
				'group-has-checked:border-color-primary group-has-checked:bg-color-primary',
			]}
		>
			<Icon class="invisible group-has-checked:visible" d={mdiCheck} size="20" />
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
