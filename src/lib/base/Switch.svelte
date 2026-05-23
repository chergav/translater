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
	<div class="group/track relative flex items-center justify-center">
		<input class="peer sr-only" {...rest} onkeydown={handlerOnKeydown} type="checkbox" bind:checked />
		<div class={track()}>
			<span class={handle()}>
				<span class={stateLayerHandle({ variant })}></span>
			</span>
		</div>
	</div>
</label>

<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type { VariantProps, ClassValue } from 'tailwind-variants';
import { tv } from './utils/tv';
import { Code } from './types/keyCodes';

const switchVariants = tv({
	slots: {
		base: [
			'group relative inline-flex cursor-pointer items-center justify-between gap-3 select-none',
			'transition-shape-colors',
			'has-disabled:pointer-events-none has-disabled:opacity-disabled',
		],
		stateLayer: [
			'pointer-events-none absolute inset-0 rounded-[inherit] bg-color-on-surface opacity-0',
			'transition-opacity ease-effects-fast',
		],
		iconClass: 'text-color-on-surface-variant [&_svg]:size-5',
		labelClass: 'text-color-on-surface',
		hintClass: 'text-sm text-color-on-surface-variant',
		track: [
			'flex size-full h-8 w-13 items-center justify-center rounded-full',
			'transition-colors ease-effects-fast',
			'border-2 border-color-outline bg-color-surface-container-highest',
			'peer-checked:border-color-primary peer-checked:bg-color-primary',
			'outline-color-secondary peer-focus-visible:outline-common',
		],
		handle: [
			'relative me-5 flex size-4 items-center justify-center rounded-full bg-color-outline transition-switch-handle',
			'group-hover/track:bg-color-on-surface-variant group-has-checked:group-hover/track:bg-color-primary-container',
			'group-has-checked:ms-5 group-has-checked:me-0 group-has-checked:size-6 group-has-checked:bg-color-on-primary',
			'group-has-active/track:size-7',
		],
		stateLayerHandle: '',
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
			},
		},
		{
			variant: ['expressive', 'baseline'],
			class: {
				base: 'rounded-sm',
				stateLayer: 'group-has-hover:opacity-hover group-has-focus-visible:opacity-pressed group-has-active:opacity-pressed',
				stateLayerHandle: 'hidden',
			},
		},
		{
			variant: 'plain',
			class: {
				// track: 'outline-color-secondary group-has-focus-visible:outline-common',
				stateLayerHandle: [
					'absolute size-10 rounded-full opacity-0 transition-opacity ease-effects-fast',
					'bg-color-on-surface group-has-checked:bg-color-primary',
					'group-hover/track:opacity-hover group-has-active:group-hover/track:opacity-pressed',
				],
			},
		},
	],
	defaultVariants: {
		variant: 'baseline',
	},
});

type SwitchVariants = VariantProps<typeof switchVariants>;

interface Props extends SwitchVariants, Omit<HTMLInputAttributes, 'class'> {
	checked: boolean
	label: string
	icon?: Snippet
	hint?: string
	class?: ClassValue
}

let {
	checked = $bindable(),
	label,
	hint,
	icon,
	class: className,
	variant = 'baseline',
	...rest
}: Props = $props();

const { base, stateLayer, iconClass, labelClass, hintClass, track, handle, stateLayerHandle } = switchVariants();

function handlerOnKeydown(e: KeyboardEvent) {
	if (e.code === Code.Enter) {
		const target = e.target as HTMLInputElement;
		target.click();
	}
}
</script>
