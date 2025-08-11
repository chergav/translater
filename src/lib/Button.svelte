<button
	class={button({
		variant,
		size,
		isLabel: !!label,
		isTab: !!tab,
		isActive: !!active,
		class: className,
	})}
	aria-label={ariaLabel || title}
	{onclick}
	{title}
	{type}
	{...rest}
>
	{#if icon}
		<Icon class={iconClass} d={icon} size={finalIconSize} />
	{/if}
	{#if label}
		<span class="whitespace-nowrap first-letter:uppercase">{label}</span>
	{/if}
	{@render children?.()}
	{#if iconRight}
		<Icon class={iconRightClass} d={iconRight} size={finalIconSize} />
	{/if}
</button>

<script lang="ts">
import type { ComponentProps, Snippet } from 'svelte';
import type { HTMLButtonAttributes, MouseEventHandler } from 'svelte/elements';
import { tv, type VariantProps, type ClassValue } from 'tailwind-variants';
import Icon from './Icon.svelte';

const button = tv({
	base: [
		'inline-flex items-center rounded-full font-medium whitespace-nowrap',
		'focus-visible:outline-custom',
		'cursor-pointer transition-colors select-none',
		'[&_svg]:pointer-events-none [&_svg]:shrink-0',
		'disabled:cursor-default disabled:opacity-50',
	],
	variants: {
		variant: {
			text: 'text-color-primary outline-color-primary enabled:hover:bg-color-primary/10 enabled:active:bg-color-primary/20',
			filled: 'bg-color-primary/100 text-color-on-primary outline-color-primary enabled:hover:bg-color-primary/90 enabled:active:bg-color-primary/80',
			outlined: [
				'relative text-color-primary outline-color-primary enabled:hover:bg-color-primary/10 enabled:active:bg-color-primary/20',
				'before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:border before:border-color-primary/50',
			],
			danger: 'bg-color-error/100 text-color-on-error outline-color-error enabled:hover:bg-color-error/90 enabled:active:bg-color-error/80',
		},
		size: {
			xs: 'h-8 gap-1 px-3 text-sm',
			sm: 'h-10 gap-2 px-4 text-sm',
			md: 'h-14 gap-2 px-6 text-base',
			lg: 'h-24 gap-3 px-12 text-2xl',
		},
		isLabel: {
			false: '',
		},
		isTab: {
			true: 'w-full justify-start',
			false: 'justify-center',
		},
		isActive: {
			true: 'bg-color-primary/10',
		},
	},
	compoundVariants: [
		{
			isLabel: false,
			class: 'p-0',
		},
		{
			isLabel: false,
			size: 'xs',
			class: 'w-8',
		},
		{
			isLabel: false,
			size: 'sm',
			class: 'w-10',
		},
		{
			isLabel: false,
			size: 'md',
			class: 'w-14',
		},
		{
			isLabel: false,
			size: 'lg',
			class: 'w-24',
		},
	],
	defaultVariants: {
		variant: 'text',
		size: 'sm',
	},
});

type ButtonVariants = VariantProps<typeof button>;
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
type IconSize = ComponentProps<typeof Icon>['size'];

interface Props extends ButtonVariants, Omit<HTMLButtonAttributes, 'class'> {
	label?: string
	tab?: boolean
	active?: boolean
	icon?: string
	iconClass?: string
	iconRight?: string
	iconRightClass?: string
	iconSize?: IconSize
	class?: ClassValue
	size?: ButtonSize
	onclick?: MouseEventHandler<HTMLButtonElement>
	children?: Snippet
}

const getIconSize = (buttonSize: ButtonSize, isIconOnly: boolean): IconSize => {
	const sizeMap = {
		xs: '20',
		sm: isIconOnly ? '24' : '20',
		md: '24',
		lg: '32',
	} as const;

	return sizeMap[buttonSize] || '20';
};

let {
	label = '',
	tab = false,
	active = false,
	type = 'button',
	icon = '',
	iconClass = '',
	iconRight = '',
	iconRightClass = '',
	iconSize,
	class: className = '',
	size = 'sm',
	variant,
	title,
	'aria-label': ariaLabel,
	onclick,
	children,
	...rest
}: Props = $props();

const finalIconSize = $derived(iconSize || getIconSize(size, !label));
</script>
