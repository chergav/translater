<li
	class={base({
		size,
		color,
	})}
	aria-disabled={disabled || undefined}
	aria-selected={selected}
	onclick={onClickHandler}
	onkeydown={onKeydownHandler}
	role="option"
	tabindex="-1"
>
	<span class={stateLayer({ color })}></span>
	<div class={content()}>
		{#if leadingIcon}
			<span class={iconClass({ color })} aria-hidden="true">
				{@render leadingIcon(selected)}
			</span>
		{/if}
		<span class={labelClass({ color })}>{label}</span>
		{#if trailingIcon}
			<span class={iconClass({ color })} aria-hidden="true">
				{@render trailingIcon(selected)}
			</span>
		{/if}
	</div>
</li>

<script generics="T" lang="ts">
import { type Snippet } from 'svelte';
import { getListboxCtx } from './context';
import type { VariantProps } from 'tailwind-variants';
import { tv } from '../utils/tv';

const listboxOption = tv({
	slots: {
		base: [
			'group relative flex min-w-40 shrink-0 cursor-pointer px-3',
			'rounded-sm first:rounded-t-xl last:rounded-b-xl',
			'outline-color-secondary focus-visible:outline-menu',
			'[&_svg]:pointer-events-none [&_svg]:shrink-0',
			'aria-disabled:pointer-events-none aria-disabled:opacity-disabled',
			'aria-selected:rounded-xl',
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
				base: 'aria-selected:bg-color-tertiary-container',
				iconClass: 'text-color-on-surface-variant group-aria-selected:text-color-on-tertiary-container',
				labelClass: 'text-color-on-surface group-aria-selected:text-color-on-tertiary-container',
				stateLayer: 'bg-color-on-surface group-aria-selected:bg-color-on-tertiary-container',
			},
			vibrant: {
				base: 'aria-selected:bg-color-tertiary',
				iconClass: 'text-color-on-tertiary-container group-aria-selected:text-color-on-tertiary',
				labelClass: 'text-color-on-tertiary-container group-aria-selected:text-color-on-tertiary',
				stateLayer: 'bg-color-on-tertiary-container group-aria-selected:bg-color-on-tertiary',
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

type ListboxOption = VariantProps<typeof listboxOption>;

interface Props extends ListboxOption {
	value: T
	label: string
	leadingIcon?: Snippet<[selected?: boolean]>
	trailingIcon?: Snippet<[selected?: boolean]>
	disabled?: boolean
	keepOpen?: boolean
}

const listboxCtx = getListboxCtx();

let {
	value,
	label,
	size,
	color = listboxCtx.color,
	leadingIcon,
	trailingIcon,
	disabled,
	keepOpen,
}: Props = $props();

const selected = $derived<boolean>(value === listboxCtx.value);

const { base, stateLayer, content, iconClass, labelClass } = listboxOption();

function onClickHandler() {
	listboxCtx.value = value;
	if (!keepOpen) listboxCtx.close();
}

function onKeydownHandler(e: KeyboardEvent) {
	if (e.code === 'Space' || e.code === 'Enter') {
		e.preventDefault();
		onClickHandler();
	}
}
</script>
