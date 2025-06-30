<label
	class={[
		'group/label inline-flex w-fit cursor-pointer items-center gap-2 select-none',
		'has-disabled:pointer-events-none has-disabled:opacity-50',
	]}
>
	<div class="group relative flex items-center justify-center">
		<input {...rest} class="peer sr-only" type="checkbox" bind:checked />
		<!-- outline -->
		<div
			class={[
				'm-3 size-[18px] rounded-xs border-2 transition-colors',
				'border-color-on-surface-variant group-hover:border-color-on-surface group-hover/label:border-color-on-surface',
			]}
		></div>
		<!-- background -->
		<div
			class={[
				'absolute size-[18px] scale-50 rounded-xs opacity-0 transition-[background-color,_transform]',
				'peer-checked:scale-100 peer-checked:bg-color-primary peer-checked:opacity-100',
			]}
		></div>
		<!-- mark -->
		<svg
			class={[
				'absolute size-[18px] scale-50 fill-none stroke-none transition-transform duration-300',
				'peer-checked:scale-100 peer-checked:fill-color-on-primary',
			]}
			viewBox="0 0 18 18"
		>
			<style>
				rect.mark {
					transform: scaleY(-1) translate(7px, -14px) rotate(45deg);
				}
			</style>
			<rect class="mark" height="6" width="2" />
			<rect class="mark" height="2" width="11" />
		</svg>
		<!-- hover elem -->
		<div
			class={[
				'absolute size-10 rounded-full transition-colors',
				'group-hover:bg-color-on-surface-variant/15 peer-checked:group-hover:bg-color-primary/15',
				'group-hover:peer-active:bg-color-on-surface-variant/25 peer-checked:peer-active:group-hover:bg-color-primary/25',
				'peer-focus-visible:outline-custom peer-focus-visible:outline-color-primary',
			]}
		></div>
	</div>
	<div class="flex flex-col gap-0.5">
		<span>{label}</span>
		{#if hint}
			<span class="text-sm text-color-on-surface-variant">{hint}</span>
		{/if}
	</div>
</label>

<script lang="ts">
import type { HTMLInputAttributes } from 'svelte/elements';

interface Props extends HTMLInputAttributes {
	checked: boolean
	label: string
	hint?: string
}

let {
	checked = $bindable(),
	label,
	hint,
	...rest
}: Props = $props();
</script>
