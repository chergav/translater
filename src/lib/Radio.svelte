<label
	class={[
		'group/label inline-flex w-fit cursor-pointer items-center gap-1 select-none',
		'has-disabled:pointer-events-none has-disabled:opacity-50',
	]}
>
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
		<!-- hover elem -->
		<div
			class={[
				'pointer-events-none absolute inset-0 m-auto size-10 rounded-full transition-colors',
				'group-hover:bg-color-on-surface-variant/15 peer-checked:group-hover:bg-color-primary/15',
				'group-hover:peer-active:bg-color-on-surface-variant/25 peer-checked:peer-active:group-hover:bg-color-primary/25',
			]}
		></div>
	</div>
	<span>{label}</span>
</label>

<script lang="ts">
import type { HTMLInputAttributes } from 'svelte/elements';

interface Props extends HTMLInputAttributes {
	group: string
	value: string
	label: string
}

let {
	group = $bindable(),
	value,
	label,
	...rest
}: Props = $props();
</script>
