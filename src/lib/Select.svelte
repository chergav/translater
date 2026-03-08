<label class={['ignore-active flex items-center justify-between gap-2 select-none', full && 'w-full' ]}>
	{#if label}
		<span class={small ? 'text-sm' : 'text-base'}>{label}</span>
	{/if}
	<select
		class={[
			'cursor-pointer rounded-lg bg-color-surface transition-colors select-none',
			'border border-color-surface-highest focus:border-color-outline-variant',
			'focus-visible:outline-custom focus-visible:outline-color-primary',
			small ? 'p-1.5 text-sm' : 'p-2.5 text-base',
			full && 'w-full',
			className,
		]}
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
