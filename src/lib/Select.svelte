<label class="text-primary" class:w-full={full}>
	{#if label}
		<span class="select-none {label ? 'mr-2' : ''}">{label}</span>
	{/if}
	<select
		class="
			{small ? 'py-1 px-2 text-sm' : 'p-2 text-base'}
			rounded-lg
			outline-0
			focus:ring-0
			bg-surface
			text-primary
			border
			border-variant-300-700
			focus-visible:border-variant-400-600
			transition-colors
			cursor-pointer
			{className}
		"
		class:w-full={full}
		{onchange}
		bind:value
	>
		{@render children?.()}
	</select>
</label>

<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any
	children: Snippet
	label?: string
	small?: boolean
	class?: string
	full?: boolean
	onchange?: () => void
}

let {
	value = $bindable(),
	children,
	label,
	small = false,
	class: className = '',
	full = false,
	onchange,
}: Props = $props();
</script>
