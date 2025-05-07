<button
	class={button({
		variant,
		isLabel: !!label,
		isIcon: !!icon,
		isIconRight: !!iconRight,
		isSmall: !!small,
		isTab: !!tab,
		isActive: !!active,
		class: className,
	})}
	{onclick}
	{type}
	{...rest}
>
	{#if icon}
		<span class={iconClass}>
			<Icon d={icon} size={iconSize} />
		</span>
	{/if}
	{#if label}
		<span class="whitespace-nowrap first-letter:uppercase">{label}</span>
	{/if}
	{@render children?.()}
	{#if iconRight}
		<span class={iconRightClass}>
			<Icon d={iconRight} size={iconSize} />
		</span>
	{/if}
	{#if variant === 'outlined'}
		<div
			class="
				pointer-events-none
				absolute
				inset-0
				rounded-full
				border
				border-purple-800/50
				dark:border-purple-200/50
			"
		>
		</div>
	{/if}
</button>

<script lang="ts">
import type { ComponentProps, Snippet } from 'svelte';
import type { HTMLButtonAttributes, MouseEventHandler } from 'svelte/elements';
import { tv, type VariantProps } from 'tailwind-variants';
import Icon from './Icon.svelte';

const button = tv({
	base: [
		'relative inline-flex items-center gap-2 whitespace-nowrap rounded-full text-sm/6 font-medium',
		'ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2',
		'dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
		'transition-colors select-none cursor-pointer',
		'[&_svg]:pointer-events-none [&_svg]:shrink-0',
		'disabled:opacity-50 disabled:cursor-default',
	],
	variants: {
		variant: {
			text: 'text-purple-900 dark:text-purple-100 enabled:hover:bg-purple-900/10 enabled:dark:hover:bg-purple-100/10 enabled:active:bg-purple-900/20 dark:enabled:active:bg-purple-100/20',
			filled: 'text-neutral-50 dark:text-neutral-900 bg-purple-800 enabled:hover:bg-purple-800/90 dark:bg-purple-200 enabled:dark:hover:bg-purple-200/90 enabled:active:bg-purple-800 dark:enabled:active:bg-purple-200',
			outlined: 'text-purple-900 dark:text-purple-100 enabled:hover:bg-purple-900/10 enabled:dark:hover:bg-purple-100/10 enabled:active:bg-purple-900/20 dark:enabled:active:bg-purple-100/20',
			danger: 'text-neutral-100 dark:text-neutral-900 bg-red-700 enabled:hover:bg-red-700/90 dark:bg-red-300 enabled:dark:hover:bg-red-300/90 enabled:active:bg-red-600 dark:enabled:active:bg-red-400',
		},
		isLabel: {
			true: '',
			false: '',
		},
		isIcon: {
			true: '',
			false: '',
		},
		isIconRight: {
			true: '',
			false: '',
		},
		isSmall: {
			true: '',
			false: '',
		},
		isTab: {
			true: 'w-full justify-start',
			false: 'w-fit justify-center',
		},
		isActive: {
			true: 'bg-purple-900/10 dark:bg-purple-100/10',
			false: '',
		},
	},
	compoundVariants: [
		{
			isLabel: true,
			class: 'py-2',
		},
		{
			isLabel: true,
			isIcon: true,
			isIconRight: true,
			class: 'px-4',
		},
		{
			isLabel: true,
			isIcon: true,
			isIconRight: false,
			class: 'pl-4 pr-6',
		},
		{
			isLabel: true,
			isIcon: false,
			isIconRight: true,
			class: 'pr-4 pl-6',
		},
		{
			isLabel: true,
			isIcon: false,
			isIconRight: false,
			class: 'px-6',
		},
		{
			isLabel: false,
			isIcon: true,
			class: 'p-2 size-10',
		},
		{
			isLabel: true,
			isIcon: true,
			isSmall: true,
			class: 'px-3 py-1',
		},
		{
			isLabel: true,
			isIconRight: true,
			isSmall: true,
			class: 'px-3 py-1',
		},
		{
			isLabel: false,
			isIcon: true,
			isSmall: true,
			class: 'p-1 size-7',
		},
	],
	defaultVariants: {
		variant: 'text',
		isLabel: false,
		isIcon: false,
		isIconRight: false,
		isSmall: false,
	},
});

type ButtonVariants = VariantProps<typeof button>;

interface Props extends HTMLButtonAttributes {
	label?: string
	tab?: boolean
	active?: boolean
	icon?: string
	iconRight?: string
	iconSize?: ComponentProps<typeof Icon>['size']
	class?: string
	variant?: ButtonVariants['variant']
	small?: boolean
	iconClass?: string
	iconRightClass?: string
	onclick: MouseEventHandler<HTMLButtonElement>
	children?: Snippet
}

let {
	label = '',
	tab = false,
	active = false,
	type = 'button',
	icon = '',
	iconRight = '',
	iconSize = label ? '18' : '24',
	class: className = '',
	variant = 'text',
	small = false,
	iconClass = '',
	iconRightClass = '',
	onclick,
	children,
	...rest
}: Props = $props();
</script>
