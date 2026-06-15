<button
	bind:this={ref}
	class={base({
		size,
		color,
		shape,
		toggle,
		shapeMorph,
		class: className,
	})}
	aria-pressed={ariaPressed}
	onclick={onClickHandler}
	{type}
	{...rest}
>
	<span
		class={stateLayer({
			color,
			active,
			toggle,
		})}
	></span>
	<span
		class={content({
			size,
			color,
			toggle,
		})}
		>
		{#if leadingIcon}
			<span class={iconClass({ size })} aria-hidden="true">
				{#if selected && selectedIcon}
					{@render selectedIcon(selected)}
				{:else}
					{@render leadingIcon(selected)}
				{/if}
			</span>
		{/if}
		{#if label}
			<span
				class={labelClass({
					size,
					color,
				})}
			>{label}</span>
		{/if}
		<!-- {@render children?.(selected)} -->
		{#if trailingIcon}
			<span class={iconClass({ size })} aria-hidden="true">
				{#if selected && selectedTrailingIcon}
					{@render selectedTrailingIcon(selected)}
				{:else}
					{@render trailingIcon(selected)}
				{/if}
			</span>
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
			'group relative flex cursor-pointer items-center select-none',
			'outline-color-secondary transition-shape-colors focus-visible:outline-common',
			'[&_svg]:pointer-events-none [&_svg]:shrink-0',
			'disabled:pointer-events-none disabled:cursor-default disabled:bg-color-on-surface/10',
			'transform-gpu',
		],
		stateLayer: [
			'pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity ease-effects-fast',
			'group-hover:opacity-hover group-focus-visible:opacity-pressed group-active:opacity-pressed',
		],
		content: 'relative flex w-full items-center group-disabled:text-color-on-surface group-disabled:opacity-disabled',
		iconClass: '',
		labelClass: 'max-w-full truncate font-medium whitespace-nowrap',
	},
	variants: {
		color: {
			filled: {
				base: 'bg-color-primary',
				content: 'text-color-on-primary',
				stateLayer: 'bg-color-on-primary',
			},
			tonal: {
				base: 'bg-color-secondary-container',
				content: 'text-color-on-secondary-container',
				stateLayer: 'bg-color-on-secondary-container',
			},
			outlined: {
				base: 'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-color-outline-variant',
				content: 'text-color-on-surface-variant',
				stateLayer: 'bg-color-on-surface-variant',
			},
			text: {
				content: 'text-color-primary',
				stateLayer: 'bg-color-primary',
			},
		},
		size: {
			xs: {
				base: 'h-8 rounded-2xl px-3',
				content: 'gap-1',
				iconClass: '[&_svg]:size-5',
				labelClass: 'text-sm',
			},
			sm: {
				base: 'h-10 rounded-20 px-4',
				content: 'gap-2',
				iconClass: '[&_svg]:size-5',
				labelClass: 'text-sm',
			},
			md: {
				base: 'h-14 rounded-28 px-6',
				content: 'gap-2',
				iconClass: '[&_svg]:size-6',
				labelClass: 'text-base',
			},
			lg: {
				base: 'h-24 rounded-48 px-12',
				content: 'gap-3',
				iconClass: '[&_svg]:size-8',
				labelClass: 'text-2xl',
			},
		},
		toggle: {
			true: '',
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
				content: 'text-color-on-surface-variant group-aria-pressed:text-color-on-primary',
				stateLayer: 'bg-color-on-surface-variant group-aria-pressed:bg-color-on-primary',
			},
		},
		{
			color: 'tonal',
			toggle: true,
			class: {
				base: 'bg-color-secondary-container aria-pressed:bg-color-secondary',
				content: 'text-color-on-secondary-container group-aria-pressed:text-color-on-secondary',
				stateLayer: 'bg-color-on-secondary-container group-aria-pressed:bg-color-on-secondary',
			},
		},
		{
			color: 'outlined',
			toggle: true,
			class: {
				base: 'aria-pressed:bg-color-inverse-surface aria-pressed:before:border-color-inverse-surface',
				content: 'text-color-on-surface-variant group-aria-pressed:text-color-inverse-on-surface',
				stateLayer: 'bg-color-on-surface-variant group-aria-pressed:bg-color-inverse-on-surface',
			},
			// The text button doesn't have a toggle state
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
		size: 'sm',
	},
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface Props extends ButtonVariants, Omit<HTMLButtonAttributes, 'class' | 'color'> {
	label: string
	ref?: HTMLButtonElement | null
	leadingIcon?: Snippet<[selected?: boolean]>
	selectedIcon?: Snippet<[selected?: boolean]>
	trailingIcon?: Snippet<[selected?: boolean]>
	selectedTrailingIcon?: Snippet<[selected?: boolean]>
	class?: ClassValue
	selected?: boolean
	onclick?: MouseEventHandler<HTMLButtonElement>
	// children?: Snippet<[selected?: boolean]>
}

let {
	label,
	ref = $bindable(null),
	type = 'button',
	leadingIcon,
	selectedIcon,
	trailingIcon,
	selectedTrailingIcon,
	class: className = '',
	size = 'sm',
	color = 'filled', // to work with compoundVariants
	shape = 'round',
	shapeMorph,
	toggle,
	selected = $bindable(false),
	active,
	onclick,
	// children,
	...rest
}: Props = $props();

const ariaPressed = $derived<boolean | undefined>(toggle ? selected : undefined);

const onClickHandler: MouseEventHandler<HTMLButtonElement> = event => {
	if (toggle) {
		selected = !selected;
	}
	onclick?.(event);
};

const { base, content, stateLayer, labelClass, iconClass } = buttonVariants();
</script>
