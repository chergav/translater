<button
	bind:this={ref}
	class={base({
		size,
		width,
		color,
		toggle,
		shape,
		shapeMorph,
		class: className,
	})}
	aria-label={ariaLabel}
	aria-pressed={ariaPressed}
	onclick={onClickHandler}
	{title}
	{type}
	{...rest}
>
	<span
		class={stateLayer({
			color,
			toggle,
			active,
		})}
	></span>
	<span
		class={iconClass({
			size,
			color,
			toggle,
		})}
		aria-hidden="true"
	>
		{#if selected && selectedIcon}
			{@render selectedIcon(selected)}
		{:else}
			{@render children(selected)}
		{/if}
	</span>
</button>

<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes, MouseEventHandler } from 'svelte/elements';
import type { VariantProps, ClassValue } from 'tailwind-variants';
import { tv } from './utils/tv';

const buttonVariants = tv({
	slots: {
		base: [
			'group relative flex cursor-pointer items-center justify-center select-none transition-shape-colors',
			'outline-color-secondary focus-visible:outline-common',
			'[&_svg]:pointer-events-none [&_svg]:shrink-0',
			'disabled:pointer-events-none disabled:cursor-default',
			'transform-gpu',
		],
		stateLayer: [
			'pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity ease-effects-fast',
			'group-hover:opacity-hover group-focus-visible:opacity-pressed group-active:opacity-pressed',
		],
		iconClass: 'relative flex items-center group-disabled:text-color-on-surface group-disabled:opacity-disabled',
	},
	variants: {
		color: {
			filled: {
				base: 'bg-color-primary disabled:bg-color-on-surface/10',
				iconClass: 'text-color-on-primary',
				stateLayer: 'bg-color-on-primary',
			},
			tonal: {
				base: 'bg-color-secondary disabled:bg-color-on-surface/10',
				iconClass: 'text-color-on-secondary',
				stateLayer: 'bg-color-on-secondary',
			},
			outlined: {
				base: 'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-color-outline-variant',
				iconClass: 'text-color-on-surface-variant',
				stateLayer: 'bg-color-on-surface-variant',
			},
			standard: {
				iconClass: 'text-color-on-surface-variant group-disabled:text-color-on-surface',
				stateLayer: 'bg-color-on-surface-variant',
			},
		},
		size: {
			xs: {
				base: 'h-8 rounded-2xl',
				iconClass: '[&_svg]:size-5',
			},
			sm: {
				base: 'h-10 rounded-20',
				iconClass: '[&_svg]:size-6',
			},
			md: {
				base: 'h-14 rounded-28',
				iconClass: '[&_svg]:size-6',
			},
			lg: {
				base: 'h-24 rounded-48',
				iconClass: '[&_svg]:size-8',
			},
		},
		toggle: {
			true: '',
		},
		width: {
			narrow: '',
			default: '',
			wide: '',
		},
		shape: {
			round: '',
			square: '',
		},
		shapeMorph: {
			true: '',
		},
		active: {
			true: {
				stateLayer: 'opacity-pressed!',
			},
		},
	},
	compoundVariants: [
		// Toggle (selection)
		{
			color: 'filled',
			toggle: true,
			class: {
				base: 'bg-color-surface-container aria-pressed:bg-color-primary',
				iconClass: 'text-color-on-surface-variant group-aria-pressed:text-color-on-primary',
				stateLayer: 'bg-color-on-surface-variant group-aria-pressed:bg-color-on-primary',
			},
		},
		{
			color: 'tonal',
			toggle: true,
			class: {
				base: 'bg-color-secondary-container aria-pressed:bg-color-secondary',
				iconClass: 'text-color-on-secondary-container group-aria-pressed:text-color-on-secondary',
				stateLayer: 'bg-color-on-secondary-container group-aria-pressed:bg-color-on-secondary',
			},
		},
		{
			color: 'outlined',
			toggle: true,
			class: {
				base: 'aria-pressed:bg-color-inverse-surface aria-pressed:before:border-color-inverse-surface',
				iconClass: 'text-color-on-surface-variant group-aria-pressed:text-color-inverse-on-surface',
				stateLayer: 'bg-color-on-surface-variant group-aria-pressed:bg-color-inverse-on-surface',
			},
		},
		{
			color: 'standard',
			toggle: true,
			class: {
				iconClass: 'text-color-on-surface-variant group-aria-pressed:text-color-primary',
				stateLayer: 'bg-color-on-surface-variant group-aria-pressed:bg-color-primary',
			},
		},
		// Xsmall widths
		{
			size: 'xs',
			width: 'narrow',
			class: 'w-7',
		},
		{
			size: 'xs',
			width: 'default',
			class: 'w-8',
		},
		{
			size: 'xs',
			width: 'wide',
			class: 'w-10',
		},
		// Small widths
		{
			size: 'sm',
			width: 'narrow',
			class: 'w-8',
		},
		{
			size: 'sm',
			width: 'default',
			class: 'w-10',
		},
		{
			size: 'sm',
			width: 'wide',
			class: 'w-13',
		},
		// Medium widths
		{
			size: 'md',
			width: 'narrow',
			class: 'w-12',
		},
		{
			size: 'md',
			width: 'default',
			class: 'w-14',
		},
		{
			size: 'md',
			width: 'wide',
			class: 'w-18',
		},
		// Large widths
		{
			size: 'lg',
			width: 'narrow',
			class: 'w-16',
		},
		{
			size: 'lg',
			width: 'default',
			class: 'w-24',
		},
		{
			size: 'lg',
			width: 'wide',
			class: 'w-32',
		},
		// Round
		{
			shape: 'round',
			toggle: true,
			size: 'xs',
			class: 'aria-pressed:rounded-xl',
		},
		{
			shape: 'round',
			toggle: true,
			size: 'sm',
			class: 'aria-pressed:rounded-xl',
		},
		{
			shape: 'round',
			toggle: true,
			size: 'md',
			class: 'aria-pressed:rounded-2xl',
		},
		{
			shape: 'round',
			toggle: true,
			size: 'lg',
			class: 'aria-pressed:rounded-28',
		},
		// Square
		{
			shape: 'square',
			size: 'xs',
			class: 'rounded-xl aria-pressed:rounded-2xl',
		},
		{
			shape: 'square',
			size: 'sm',
			class: 'rounded-xl aria-pressed:rounded-20',
		},
		{
			shape: 'square',
			size: 'md',
			class: 'rounded-2xl aria-pressed:rounded-28',
		},
		{
			shape: 'square',
			size: 'lg',
			class: 'rounded-28 aria-pressed:rounded-48',
		},
		// Shape morph
		{
			shapeMorph: true,
			size: ['xs', 'sm'],
			class: 'enabled:active:rounded-lg',
		},
		{
			shapeMorph: true,
			size: 'md',
			class: 'enabled:active:rounded-xl',
		},
		{
			shapeMorph: true,
			size: 'lg',
			class: 'enabled:active:rounded-2xl',
		},
		// Lg outlined border-2
		{
			color: 'outlined',
			size: 'lg',
			class: 'before:border-2',
		},
	],
	// this doesn't work with compoundVariants (tailwind-variants issue)
	defaultVariants: {
		color: 'filled',
		toggle: false,
		size: 'sm',
	},
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface Props extends ButtonVariants, Omit<HTMLButtonAttributes, 'class' | 'color'> {
	title: string
	children: Snippet<[selected?: boolean]>
	ref?: HTMLButtonElement | null
	class?: ClassValue
	selected?: boolean
	selectedIcon?: Snippet<[selected?: boolean]>
	onclick?: MouseEventHandler<HTMLButtonElement>
}

let {
	title,
	children,
	ref = $bindable(null),
	type = 'button',
	class: className,
	size = 'sm',
	toggle = false,
	selected = $bindable(false),
	selectedIcon,
	color = 'filled', // to work with compoundVariants
	shape = 'round',
	width = 'default',
	shapeMorph,
	active,
	'aria-label': ariaLabel = title,
	onclick,
	...rest
}: Props = $props();

const ariaPressed = $derived<boolean | undefined>(toggle ? selected : undefined);

const onClickHandler: MouseEventHandler<HTMLButtonElement> = event => {
	if (toggle) {
		selected = !selected;
	}
	onclick?.(event);
};

const { base, stateLayer, iconClass } = buttonVariants();
</script>
