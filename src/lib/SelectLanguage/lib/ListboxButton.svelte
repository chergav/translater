<button
	bind:this={ref}
	class={base({
		size,
		class: className,
	})}
	aria-expanded={listboxCtx.open}
	aria-haspopup="listbox"
	onclick={listboxCtx.toggle}
	onkeydown={handleKeydown}
	type="button"
	{...rest}
>
	<span class={outline({ lowAccent })}></span>
	<div class={content({ size })}>
		{#if leadingIcon}
			<span class={iconClass({ size })}>
				{@render leadingIcon(listboxCtx.open)}
			</span>
		{/if}
		<span
			class={labelClass({
				size,
				lowAccent,
			})}
		>{@render children()}</span>
		{#if trailingIcon}
			<span class={iconClass({ size })}>
				{@render trailingIcon(listboxCtx.open)}
			</span>
		{:else}
			<span class={iconClass({ size })}>
				<ArrowDropDown
					class={[
						'transition-transform ease-effects-fast',
						listboxCtx.open && '-scale-y-100',
					]}
				/>
			</span>
		{/if}
	</div>
</button>

<script lang="ts">
import { type Snippet, onMount } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import { Code } from '../../base/types/keyCodes';
import { getListboxCtx } from './context';
import type { VariantProps, ClassValue } from 'tailwind-variants';
import { tv } from '../../base/utils/tv';
import ArrowDropDown from '~icons/material-symbols/arrow-drop-down-rounded';

const listboxButton = tv({
	slots: {
		base: [
			'group relative flex shrink-0 cursor-pointer items-center rounded-sm bg-transparent px-3',
			'outline-none aria-disabled:pointer-events-none aria-disabled:opacity-disabled',
			'[&_svg]:pointer-events-none [&_svg]:shrink-0',
		],
		outline: [
			'pointer-events-none absolute inset-0 rounded-[inherit]',
			'before:absolute before:inset-0 before:rounded-[inherit] before:border',
			'before:transition-[border-color] before:ease-effects-fast',
			'after:absolute after:inset-0 after:rounded-[inherit] after:border-3 after:opacity-0',
			'after:transition-opacity after:ease-effects-fast',
			'after:border-color-primary group-focus-visible:after:opacity-100 group-active:after:opacity-100 group-aria-expanded:after:opacity-100',
		],
		content: 'relative flex w-full items-center',
		iconClass: 'text-color-on-surface-variant [&:not(:has(svg))]:hidden',
		labelClass: 'inline-block flex-1 truncate text-start whitespace-nowrap',
	},
	variants: {
		size: {
			xs: {
				base: 'h-8',
				content: 'gap-2',
				iconClass: '[&_svg]:size-5',
				labelClass: 'text-sm',
			},
			sm: {
				base: 'h-10',
				content: 'gap-4',
				iconClass: '[&_svg]:size-6',
				labelClass: 'text-base',
			},
		},
		lowAccent: {
			true: {
				outline: 'before:border-color-outline-variant group-hover:before:border-color-outline',
				labelClass: [
					'text-color-on-surface-variant group-hover:text-color-on-surface group-aria-expanded:text-color-on-surface',
					'transition-colors ease-effects-fast',
				],
			},
			false: {
				outline: 'before:border-color-outline group-hover:before:border-color-on-surface',
				labelClass: 'text-color-on-surface',
			},
		},
	},
	defaultVariants: {
		size: 'sm',
	},
});

type ListboxButton = VariantProps<typeof listboxButton>;

interface Props extends ListboxButton, Omit<HTMLButtonAttributes, 'class' | 'color'> {
	label?: string
	ref?: HTMLButtonElement | null
	children: Snippet
	leadingIcon?: Snippet<[open?: boolean]>
	trailingIcon?: Snippet<[open?: boolean]>
	class?: ClassValue
}

let {
	children,
	ref = $bindable(null),
	leadingIcon,
	trailingIcon,
	size,
	class: className,
	lowAccent,
	...rest
}: Props = $props();

const listboxCtx = getListboxCtx();
const { base, outline, content, iconClass, labelClass } = listboxButton();

function handleKeydown(e: KeyboardEvent) {
	switch (e.code) {
		case Code.ArrowDown:
		case Code.ArrowUp:
			e.preventDefault();
			e.stopPropagation();
			listboxCtx.openListbox();
			break;
	}
}

onMount(() => {
	listboxCtx.triggerRef =	ref;
});
</script>
