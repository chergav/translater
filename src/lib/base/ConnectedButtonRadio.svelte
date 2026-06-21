<label
	class={base({
		color,
		size,
		class: className,
	})}
	{title}
>
	<span class={stateLayer({ color })}></span>
	<span class={content({ color })}>
		{#if icon}
			<span class={iconClass({ size })} aria-hidden="true">
				{#if selected && selectedIcon}
					{@render selectedIcon(selected)}
				{:else}
					{@render icon(selected)}
				{/if}
			</span>
		{/if}
		{@render children?.()}
		{#if label}
			<span class={labelClass({ size })}>{label}</span>
		{/if}
		{#if trailingIcon}
			<span class={iconClass({ size })} aria-hidden="true">
				{@render trailingIcon(selected)}
			</span>
		{/if}
	</span>
	<input
		{name}
		class="sr-only"
		aria-label={ariaLabel}
		type="radio"
		{value}
		bind:group
		{...rest}
	/>
</label>

<script generics="T" lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import { cn, type VariantProps, type ClassValue } from 'tailwind-variants';
import { tv } from './utils/tv';

const button = tv({
	slots: {
		base: [
			'group relative flex min-w-12 items-center justify-center select-none',
			'cursor-pointer outline-color-secondary transition-shape-colors has-focus-visible:outline-common',
			'transform-gpu', // prevent subpixel rendering artifact
		],
		stateLayer: [
			'pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity ease-effects-fast',
			'group-has-hover:opacity-hover group-has-focus-visible:opacity-pressed group-has-active:opacity-pressed',
		],
		content: 'relative flex items-center',
		labelClass: 'font-medium whitespace-nowrap',
		iconClass: '',
	},
	variants: {
		color: {
			filled: {
				base: 'bg-color-surface-container has-checked:bg-color-primary',
				content: 'text-color-on-surface-variant group-has-checked:text-color-on-primary',
				stateLayer: 'bg-color-on-surface-variant group-has-checked:bg-color-on-primary',
			},
			tonal: {
				base: 'bg-color-secondary-container has-checked:bg-color-secondary',
				content: 'text-color-on-secondary-container group-has-checked:text-color-on-secondary',
				stateLayer: 'bg-color-on-secondary-container group-has-checked:bg-color-on-secondary',
			},
			outlined: {
				base: cn(
					'has-checked:bg-color-inverse-surface has-checked:before:border-color-inverse-surface',
					'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-color-outline-variant',
				),
				content: 'text-color-on-surface-variant group-has-checked:text-color-inverse-on-surface',
				stateLayer: 'bg-color-on-surface-variant group-has-checked:bg-color-inverse-on-surface',
			},
		},
		size: {
			xs: {
				base: cn(
					'h-8 rounded-lg px-3 text-sm first:rounded-l-2xl last:rounded-r-2xl has-checked:rounded-2xl',
					'has-active:rounded-xs first:has-active:rounded-l-2xl last:has-active:rounded-r-2xl',
				),
				content: 'gap-1',
				iconClass: '[&_svg]:size-5',
				labelClass: 'text-sm',
			},
			sm: {
				base: cn(
					'h-10 rounded-lg px-4 text-sm first:rounded-l-20 last:rounded-r-20 has-checked:rounded-20',
					'has-active:rounded-sm first:has-active:rounded-l-20 last:has-active:rounded-r-20',
				),
				content: 'gap-2',
				iconClass: '[&_svg]:size-5',
				labelClass: 'text-sm',
			},
			md: {
				base: cn(
					'h-14 rounded-lg px-6 text-base first:rounded-l-28 last:rounded-r-28 has-checked:rounded-28',
					'has-active:rounded-sm first:has-active:rounded-l-28 last:has-active:rounded-r-28',
				),
				content: 'gap-2',
				iconClass: '[&_svg]:size-6',
				labelClass: 'text-base',
			},
		},
	},
	defaultVariants: {
		color: 'filled',
		size: 'sm',
	},
});

type ButtonVariants = VariantProps<typeof button>;

interface Props extends ButtonVariants, Omit<HTMLInputAttributes, 'class' | 'color' | 'size'> {
	group: T
	value: T
	name: string
	label?: string
	title?: string
	icon?: Snippet<[selected?: boolean]>
	selectedIcon?: Snippet<[selected?: boolean]>
	trailingIcon?: Snippet<[selected?: boolean]>
	class?: ClassValue
	children?: Snippet
}

let {
	group = $bindable(),
	value,
	name,
	color = 'filled',
	label,
	title,
	icon,
	selectedIcon,
	trailingIcon,
	size = 'sm',
	class: className = '',
	'aria-label': ariaLabel = title,
	children,
	...rest
}: Props = $props();

const { base, content, labelClass, iconClass, stateLayer } = button();
const selected = $derived<boolean>(group === value);
</script>
