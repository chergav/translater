<li
	class={base({ size })}
	aria-disabled={disabled || undefined}
	onclick={onClickHandler}
	onkeydown={onKeydownHandler}
	role="menuitem"
	tabindex="-1"
>
	<span class={stateLayer({ color })}></span>
	<div class={content()}>
		{#if leadingIcon}
			<span class={iconClass({ color })} aria-hidden="true">
				{@render leadingIcon()}
			</span>
		{/if}
		<span class={labelClass({ color })}>{label}</span>
		{#if trailingIcon}
			<span class={iconClass({ color })} aria-hidden="true">
				{@render trailingIcon()}
			</span>
		{/if}
	</div>
</li>

<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLLiAttributes } from 'svelte/elements';
import { getMenuCtx } from './context';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '../utils/tv';

const menuItem = tv({
	slots: {
		base: [
			'group relative flex min-w-40 shrink-0 cursor-pointer px-3',
			'rounded-sm first:rounded-t-xl last:rounded-b-xl',
			'outline-color-secondary focus-visible:outline-menu',
			'[&_svg]:pointer-events-none [&_svg]:shrink-0',
			'aria-disabled:pointer-events-none aria-disabled:opacity-disabled',
		],
		stateLayer: [
			'pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity ease-effects-fast',
			'group-hover:opacity-hover group-focus-visible:opacity-pressed group-active:opacity-pressed',
		],
		content: 'relative flex w-full items-center gap-2',
		iconClass: '[&_svg]:size-5 [&:not(:has(svg))]:hidden',
		labelClass: 'flex-1 text-sm font-medium whitespace-nowrap',
	},
	variants: {
		color: {
			standard: {
				iconClass: 'text-color-on-surface-variant',
				labelClass: 'text-color-on-surface',
				stateLayer: 'bg-color-on-surface',
			},
			vibrant: {
				iconClass: 'text-color-on-tertiary-container',
				labelClass: 'text-color-on-tertiary-container',
				stateLayer: 'bg-color-on-tertiary-container',
			},
		},
		size: {
			xs: 'h-8',
			sm: 'h-10',
		},
	},
	defaultVariants: {
		color: 'standard',
		size: 'sm',
	},
});

type MenuItem = VariantProps<typeof menuItem>;

interface Props extends MenuItem,  Omit<HTMLLiAttributes, 'color'> {
	label: string
	onclick: () => void
	leadingIcon?: Snippet
	trailingIcon?: Snippet
	disabled?: boolean
	keepOpen?: boolean
	color?: 'standard' | 'vibrant';
}

const menuCtx = getMenuCtx();

let {
	label,
	onclick,
	leadingIcon,
	trailingIcon,
	keepOpen,
	color = menuCtx.color,
	size = 'sm',
	disabled,
}: Props = $props();

const { base, stateLayer, content, iconClass, labelClass } = menuItem();

function onClickHandler() {
	onclick();
	if (!keepOpen) menuCtx.close();
}

function onKeydownHandler(e: KeyboardEvent) {
	if (e.code === 'Space' || e.code === 'Enter') {
		e.preventDefault();
		onClickHandler();
	}
}
</script>
