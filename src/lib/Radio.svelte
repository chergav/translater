{#snippet labelGroup()}
	<div class="flex items-center gap-3">
		{#if icon}
			<span class="text-color-on-surface-variant">
				<Icon d={icon} size="20" />
			</span>
		{/if}
		<div class="flex flex-col">
			<span class="text-color-on-surface">{label}</span>
			{#if hint}
				<span class="text-sm text-color-on-surface-variant">{hint}</span>
			{/if}
		</div>
	</div>
{/snippet}

<label
	class={[
		'group/label flex cursor-pointer items-center gap-1 select-none',
		'has-disabled:pointer-events-none has-disabled:opacity-50',
		isSimple ? 'w-fit' : 'w-full justify-between',
	]}
>
	{#if !isSimple}
		{@render labelGroup()}
	{/if}
	<div class="group relative flex items-center justify-center">
		<input class="peer sr-only"  {...rest} type="radio" {value} bind:group />
		<!-- outer circle -->
		<svg
			class={[
				'm-2.5 size-5 rounded-full transition-colors',
				'fill-color-on-surface-variant group-hover:fill-color-on-surface group-hover/label:fill-color-on-surface',
				'peer-checked:fill-color-primary peer-focus-visible:outline-custom peer-focus-visible:outline-color-primary',
			]}
			viewBox="0 0 20 20"
		>
			<mask id="cutout">
				<rect fill="white" height="100%" width="100%" />
				<circle cx="10" cy="10" fill="black" r="8" />
			</mask>
			<circle cx="10" cy="10" mask="url(#cutout)" r="10" />
		</svg>
		<!-- inner circle -->
		<svg
			class={[
				'absolute inset-0 m-auto size-5 transition-opacity',
				'fill-color-primary opacity-0 peer-checked:animate-circle-grow peer-checked:opacity-100',
			]}
			viewBox="0 0 20 20"
		>
			<circle cx="10" cy="10" r="5" />
		</svg>
		{#if isSimple}
			<!-- hover elem -->
			<div
				class={[
					'pointer-events-none absolute inset-0 m-auto size-10 rounded-full transition-colors',
					'group-hover:bg-color-on-surface-variant/15 peer-checked:group-hover:bg-color-primary/15',
					'group-hover:peer-active:bg-color-on-surface-variant/25 peer-checked:peer-active:group-hover:bg-color-primary/25',
				]}
			></div>
		{/if}
	</div>
	{#if isSimple}
		{@render labelGroup()}
	{/if}
</label>

<script lang="ts">
import type { HTMLInputAttributes } from 'svelte/elements';
import Icon from './Icon.svelte';

interface Props extends HTMLInputAttributes {
	group: string
	value: string
	label?: string
	hint?: string
	icon?: string
	mode?: 'simple' | 'list'
}

let {
	group = $bindable(),
	value,
	label,
	hint,
	icon,
	mode = 'simple',
	...rest
}: Props = $props();

const isSimple = $derived<boolean>(mode === 'simple');
</script>
