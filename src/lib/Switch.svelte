<label
	class={[
		'group inline-flex cursor-pointer items-center gap-4 select-none',
		'has-disabled:pointer-events-none has-disabled:opacity-50',
		className,
	]}
>
	<div class="flex flex-col gap-0.5">
		<span>{label}</span>
		{#if hint}
			<span class="text-sm text-color-on-surface-variant">{hint}</span>
		{/if}
	</div>
	<div class="group/track relative flex items-center justify-center">
		<input class="peer sr-only" {...rest} type="checkbox" bind:checked />
		<!-- track -->
		<div
			class={[
				'flex size-full items-center justify-center',
				'h-8 w-[52px] rounded-full border-2 border-color-outline bg-color-surface-high transition-colors',
				'peer-checked:border-color-primary peer-checked:bg-color-primary',
				'peer-focus-visible:outline-custom peer-focus-visible:outline-color-primary',
			]}
		>
			<!-- handle -->
			<span
				class={[
					'relative me-5 flex size-4 items-center justify-center rounded-full switch-transitions',
					'bg-color-outline group-hover/track:bg-color-on-surface-variant',
					'group-has-checked:bg-color-on-primary/100',
					'group-has-checked:ms-5 group-has-checked:me-0 group-has-checked:size-6',
					'group-has-active:group-hover/track:size-7',
				]}
			>
				<!-- overlay -->
				<span
					class={[
						'absolute size-10 rounded-full transition-colors',
						'group-hover/track:bg-color-on-surface-variant/15',
						'group-has-checked:group-hover/track:bg-color-primary/15',
						'group-has-checked:group-has-active:group-hover/track:bg-color-primary/25',
						'group-has-active:group-hover/track:bg-color-on-surface-variant/25',
					]}
				></span>
			</span>
		</div>
	</div>
</label>

<script lang="ts">
import type { HTMLInputAttributes, ClassValue } from 'svelte/elements';

interface Props extends HTMLInputAttributes {
	checked: boolean
	label: string
	hint?: string
	class?: ClassValue
}

let {
	checked = $bindable(),
	label,
	hint,
	class: className,
	...rest
}: Props = $props();
</script>
