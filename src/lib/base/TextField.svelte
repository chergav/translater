<label class={base({ class: className })}>
	{#if label}
		<span class={labelClass({ error })}>
			{label}
			{#if required}
				<span aria-hidden="true">*</span>
			{/if}
		</span>
	{/if}
	<span class={container({ variant })}>
		{#if variant === 'filled'}
			<span
				class={stateLayer({
					variant,
					error,
				})}
			></span>
		{/if}
		<span
			class={outline({
				variant,
				error,
			})}
		></span>
		<span class={content()}>
			{#if leadingIcon}
				<span class={iconClass({ class: 'pl-3' })} aria-hidden="true">
					{@render leadingIcon()}
				</span>
			{/if}
			<span class="w-full px-4">
				<input
					bind:this={ref}
					class={inputClass({ error })}
					aria-invalid={error || undefined}
					{required}
					{type}
					bind:value
					{...rest}
				>
			</span>
			{#if trailingIcon}
				<span class={iconClass({ class: 'pr-3' })}>
					{@render trailingIcon()}
				</span>
			{/if}
		</span>
	</span>
	{#if error && errorText}
		<span class="text-xs text-color-error">{errorText}</span>
	{:else if supportingText}
		<span class="text-xs text-color-on-surface-variant">{supportingText}</span>
	{/if}
</label>

<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type { VariantProps, ClassValue } from 'tailwind-variants';
import { tv } from './utils/tv';

const inputVariants = tv({
	slots: {
		base: [
			'group/input flex cursor-text flex-col gap-1',
			'has-disabled:pointer-events-none has-disabled:opacity-disabled',
		],
		labelClass: 'inline-flex items-center text-sm',
		container: [
			'relative flex rounded-t-sm py-2',
			'[&_svg]:pointer-events-none [&_svg]:shrink-0',
		],
		stateLayer: '',
		outline: [
			'pointer-events-none absolute inset-0 rounded-[inherit]',
			'before:absolute before:inset-0 before:rounded-[inherit]',
			'before:transition-[border-color] before:ease-effects-fast group-hover/input:before:border-color-on-surface',
			'after:absolute after:inset-0 after:rounded-[inherit] after:border-color-primary after:opacity-0',
			'after:transition-opacity after:ease-effects-fast group-has-focus/input:after:opacity-100 group-has-active/input:after:opacity-100',
		],
		content: 'relative flex w-full items-center',
		inputClass: 'w-full text-base caret-color-primary outline-none placeholder:text-color-on-surface-variant',
		iconClass: 'text-color-on-surface-variant [&:not(:has(svg))]:hidden [&>svg]:size-6',
	},
	variants: {
		variant: {
			filled: {
				container: 'bg-color-surface-container-highest',
				stateLayer: [
					'pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity ease-effects-fast',
					'bg-color-on-surface opacity-0 group-hover/input:opacity-hover',
				],
				outline: 'before:border-b before:border-b-color-on-surface-variant after:border-b-3',
			},
			outlined: {
				container: 'rounded-b-sm',
				outline: 'before:border before:border-color-outline after:border-3',
			},
		},
		error: {
			true: {
				labelClass: 'text-color-error',
				outline: 'before:border-color-error group-hover/input:before:border-color-error after:border-color-error',
				inputClass: 'caret-color-error',
			},
		},
	},
	defaultVariants: {
		variant: 'filled',
	},
});

type InputVariants = VariantProps<typeof inputVariants>;

interface Props extends InputVariants, Omit<HTMLInputAttributes, 'class'>{
	value: string
	ref?: HTMLInputElement | null
	label?: string
	supportingText?: string
	error?: boolean
	errorText?: string
	class?: ClassValue
	leadingIcon?: Snippet
	trailingIcon?: Snippet
}

let {
	value = $bindable(''),
	ref = $bindable(null),
	variant = 'filled',
	label = '',
	supportingText = '',
	error = false,
	errorText = '',
	class: className,
	leadingIcon,
	trailingIcon,
	type = 'text',
	required,
	...rest
}: Props = $props();

const { base, labelClass, container, stateLayer, outline, content, inputClass, iconClass } = inputVariants();
</script>
