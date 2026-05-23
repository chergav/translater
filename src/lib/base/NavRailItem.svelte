<button
	class={base({
		active,
		size,
		class: className,
	})}
	{onclick}
	{type}
	{...rest}
>
	<span
		class={activeIndicator({
			active,
			size,
		})}
	>
		<span class={stateLayer()}></span>
		<span class={content({ size })}>
			{#if icon}
				<span
					class={iconClassName({ active })}
					aria-hidden="true"
				>
					{#if active && iconActive}
						{@render iconActive()}
					{:else}
						{@render icon(active)}
					{/if}
					{#if badge}
						<span class={badgeClass()}>
							{@render badge()}
						</span>
					{/if}
				</span>
			{/if}
			{#if label}
				<span
					class={labelClass({
						active,
						size,
					})}
				>{label}</span>
			{/if}
			{#if trailingBadge}
				<span class={trailingBadgeClass()}>
					{@render trailingBadge()}
				</span>
			{/if}
		</span>
	</span>
</button>

<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes, MouseEventHandler } from 'svelte/elements';
import { tv, type VariantProps, type ClassValue } from 'tailwind-variants';

const buttonVariants = tv({
	slots: {
		base: [
			'group flex h-14 cursor-pointer items-center rounded-2xl select-none',
			'outline-color-secondary focus-visible:outline-common',
			'[&_svg]:pointer-events-none [&_svg]:shrink-0',
			'disabled:cursor-default disabled:opacity-disabled',
		],
		activeIndicator: 'relative flex h-full items-center px-4 transition-colors',
		stateLayer: [
			'pointer-events-none absolute inset-0 rounded-[inherit] bg-color-on-secondary-container opacity-0 transition-opacity ease-effects-fast',
			'group-hover:opacity-hover group-focus-visible:opacity-pressed group-active:opacity-pressed',
		],
		content: 'relative flex items-center',
		iconClassName: 'relative',
		badgeClass: 'absolute top-0 right-0 inline-flex',
		trailingBadgeClass: '',
		labelClass: 'text-start text-sm font-medium',
	},
	variants: {
		active: {
			true: {
				iconClassName: 'text-color-on-secondary-container',
				labelClass: 'text-color-on-secondary-container',
				activeIndicator: 'bg-color-secondary-container',
			},
			false: {
				iconClassName: 'text-color-on-surface-variant',
				labelClass: 'text-color-on-surface-variant',
			},
		},
		size: {
			sm: {
				base: 'h-10',
				activeIndicator: 'rounded-3xl',
				iconClassName: '[&_svg]:size-5',
				content: 'gap-1',
			},
			md: {
				base: 'h-14',
				activeIndicator: 'rounded-4xl',
				iconClassName: '[&_svg]:size-6',
				content: 'gap-2',
			},
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface Props extends ButtonVariants, Omit<HTMLButtonAttributes, 'class'> {
	label: string
	active: boolean
	icon?: Snippet<[active?: boolean]>
	iconActive?: Snippet
	badge?: Snippet
	trailingBadge?: Snippet
	class?: ClassValue
	onclick?: MouseEventHandler<HTMLButtonElement>
}

let {
	label,
	active = false,
	type = 'button',
	icon,
	iconActive,
	badge,
	trailingBadge,
	class: className = '',
	size = 'md',
	onclick,
	...rest
}: Props = $props();

const { base, activeIndicator, stateLayer, content, labelClass, badgeClass, trailingBadgeClass, iconClassName } = buttonVariants();
</script>
