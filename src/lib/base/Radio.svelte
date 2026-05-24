<label
	class={base({
		variant,
		class: className,
	})}
>
	<span class={stateLayer({ variant })}></span>
	<div class="relative flex items-center gap-3">
		{#if icon}
			<span class={iconClass({ variant })} aria-hidden="true">
				{@render icon()}
			</span>
		{/if}
		<div class="flex flex-col">
			<span class={labelClass({ variant })}>{label}</span>
			{#if hint}
				<span class={hintClass({ variant })}>{hint}</span>
			{/if}
		</div>
	</div>
	<div class="group/icon relative flex items-center justify-center">
		<input {name} class="peer sr-only" {...rest} type="radio" {value} bind:group />
		<!-- outer circle -->
		<svg
			class={[
				'm-2.5 size-5 rounded-full transition-[fill] ease-effects-fast',
				'fill-color-on-surface-variant peer-checked:fill-color-primary',
				'peer-not-checked:peer-hover:fill-color-on-surface',
				'peer-focus-visible:outline-common peer-focus-visible:outline-color-primary',
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
				'absolute inset-0 m-auto size-5 transition-opacity ease-effects-fast',
				'fill-color-primary opacity-0 peer-checked:animate-circle-grow peer-checked:opacity-100',
			]}
			viewBox="0 0 20 20"
		>
			<circle cx="10" cy="10" r="5" />
		</svg>
		<span class={stateLayerIcon({ variant })}></span>
	</div>
</label>

<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type { VariantProps, ClassValue } from 'tailwind-variants';
import { tv } from './utils/tv';

const radio = tv({
	slots: {
		base: [
			'group relative flex cursor-pointer items-center gap-1 select-none',
			'has-disabled:pointer-events-none has-disabled:opacity-disabled',
			'transition-shape-colors',
		],
		iconClass: 'text-color-on-surface-variant [&_svg]:size-5',
		labelClass: 'text-color-on-surface',
		hintClass: 'text-sm text-color-on-surface-variant',
		stateLayer: [
			'pointer-events-none absolute inset-0 rounded-[inherit] bg-color-on-surface opacity-0',
			'transition-opacity ease-effects-fast',
		],
		stateLayerIcon: '',
	},
	variants: {
		variant: {
			expressive: '',
			baseline: '',
			plain: '',
		},
	},
	compoundVariants: [
		{
			variant: 'expressive',
			class: {
				base: [
					'has-checked:bg-color-secondary-container',
					'has-checked:rounded-2xl has-hover:rounded-xl has-checked:has-hover:rounded-2xl has-active:rounded-2xl',
					'rounded-sm first:rounded-t-2xl last:rounded-b-2xl',
				],
				iconClass: 'group-has-checked:text-color-on-secondary-container',
				labelClass: 'group-has-checked:text-color-on-secondary-container',
				hintClass: 'group-has-checked:text-color-on-secondary-container',
				stateLayerHandle: 'hidden',
			},
		},
		{
			variant: ['expressive', 'baseline'],
			class: {
				base: 'justify-between rounded-sm',
				stateLayer: 'group-has-hover:opacity-hover group-has-focus-visible:opacity-pressed group-has-active:opacity-pressed',
				stateLayerIcon: 'hidden',
			},
		},
		{
			variant: 'plain',
			class: {
				base: 'flex-row-reverse justify-end',
				stateLayerIcon: [
					'pointer-events-none absolute inset-0 m-auto size-10 rounded-full opacity-0',
					'transition-opacity ease-effects-fast',
					'bg-color-on-surface peer-checked:bg-color-primary',
					'group-hover/icon:opacity-hover group-active/icon:opacity-pressed',
				],
			},
		},
	],
	defaultVariants: {
		variant: 'baseline',
	},
});

type Radio = VariantProps<typeof radio>;

interface Props extends Radio, Omit<HTMLInputAttributes, 'class'> {
	group: string
	value: string
	name: string
	icon?: Snippet
	label?: string
	hint?: string
	class?: ClassValue
}

let {
	group = $bindable(),
	value,
	name,
	icon,
	label,
	hint,
	class: className,
	variant = 'baseline',
	...rest
}: Props = $props();

const { base, stateLayer, iconClass, labelClass, hintClass, stateLayerIcon } = radio();
</script>
