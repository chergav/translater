<button
	class={base({
		size,
		isLabel: !!label,
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
		<Icon
			class={iconClassName({
				isActive: !!active,
				class: iconClass,
			})}
			d={active && iconActive ? iconActive : icon}
			size={finalIconSize}
		/>
	{/if}
	{#if label}
		<span class="truncate whitespace-nowrap first-letter:uppercase">{label}</span>
	{/if}
	{@render children?.()}
	{#if iconRight}
		<Icon
			class={iconClassName({
				isActive: !!active,
				class: iconRightClass,
			})}
			d={iconRight}
			size={finalIconSize}
		/>
	{/if}
</button>

<script lang="ts">
import type { ComponentProps, Snippet } from 'svelte';
import type { HTMLButtonAttributes, MouseEventHandler } from 'svelte/elements';
import { tv, type ClassValue } from 'tailwind-variants';
import Icon from './Icon.svelte';

const cx = (...classes: string[]) => classes.join(' ');

const button = tv({
	slots: {
		base: [
			'inline-flex w-full items-center justify-center font-medium whitespace-nowrap',
			'cursor-pointer select-none focus-visible:outline-custom',
			'transition-[color,background-color,border-radius] duration-200',
			'[&_svg]:pointer-events-none [&_svg]:shrink-0',
			'disabled:cursor-default disabled:opacity-50',
			'bg-color-surface-container hover:bg-color-surface-high active:bg-color-surface-highest',
		],
		iconClassName: '',
	},
	variants: {
		size: {
			xs: 'h-8 gap-1 px-3 text-sm',
			sm: 'h-10 gap-2 px-4 text-sm',
			md: 'h-14 gap-2 px-6 text-base',
			lg: 'h-24 gap-3 px-12 text-2xl',
		},
		isLabel: {
			true: '',
			false: '',
		},
		isActive: {
			true: {
				base: cx(
					'bg-color-primary/100 enabled:hover:bg-color-primary/90 enabled:active:bg-color-primary/80',
					'rounded-4xl text-color-on-primary outline-color-primary',
				),
				iconClassName: 'text-color-on-primary',
			},
			false: {
				base: 'rounded-lg text-color-on-surface',
				iconClassName: 'text-color-on-surface-variant',
			},
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

const { base, iconClassName } = button();

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
type IconSize = ComponentProps<typeof Icon>['size'];

interface Props extends Omit<HTMLButtonAttributes, 'class'> {
	label?: string
	active?: boolean
	icon?: string
	iconActive?: string
	iconClass?: ClassValue
	iconRight?: string
	iconRightClass?: ClassValue
	iconSize?: IconSize
	class?: ClassValue
	size?: ButtonSize
	onclick?: MouseEventHandler<HTMLButtonElement>
	children?: Snippet
}

const getIconSize = (buttonSize: ButtonSize, isIconOnly: boolean): IconSize => {
	const sizeMap = {
		xs: '18',
		sm: isIconOnly ? '22' : '18',
		md: '22',
		lg: '28',
	} as const;

	return sizeMap[buttonSize] || '18';
};

let {
	label = '',
	active = false,
	type = 'button',
	icon = '',
	iconActive,
	iconClass = '',
	iconRight = '',
	iconRightClass = '',
	iconSize,
	class: className = '',
	size = 'sm',
	title,
	'aria-label': ariaLabel,
	onclick,
	children,
	...rest
}: Props = $props();

const finalIconSize = $derived(iconSize || getIconSize(size, !label));
</script>
