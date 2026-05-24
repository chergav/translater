<label
	class={[
		'group flex items-center justify-between gap-2 rounded-sm select-none',
		'has-disabled:pointer-events-none has-disabled:opacity-disabled',
		label || full ? 'w-full' : 'w-fit',
		className,
	]}
>
	{#if label}
		<div class="flex items-center gap-3">
			{#if labelIcon}
				<span class={iconClass({ size })} aria-hidden="true">
					{@render labelIcon()}
				</span>
			{/if}
			<div class="flex flex-col">
				<span class={labelClass()}>{label}</span>
				{#if hint}
					<span class="text-sm text-color-on-surface-variant">{hint}</span>
				{/if}
			</div>
		</div>
	{/if}
	<span class={['relative', full && 'w-full' ]}>
		<span class={outline()}></span>
		<span
			class="pointer-events-none absolute inset-y-0 right-3 flex items-center"
			aria-hidden="true"
		>
			<ArrowDropDown class={trailingIconClass({ size })} />
		</span>
		<select
			class={base({
				size,
				full,
			})}
			{onchange}
			bind:value
			{...rest}
		>
			{@render children()}
		</select>
	</span>
</label>

<script generics="T" lang="ts">
import type { Snippet } from 'svelte';
import type { ClassValue, HTMLSelectAttributes } from 'svelte/elements';
import type { VariantProps } from 'tailwind-variants';
import { tv } from './utils/tv';
import ArrowDropDown from '~icons/material-symbols/arrow-drop-down-rounded';

const selectVariants = tv({
	slots: {
		base: [
			'flex shrink-0 cursor-pointer appearance-none items-center bg-transparent pr-13 pl-3 select-none',
			'text-color-on-surface outline-none *:bg-color-surface-container-low *:text-sm *:font-medium',
			'[&_svg]:pointer-events-none [&_svg]:shrink-0',
		],
		outline: [
			'pointer-events-none absolute inset-0 rounded-sm',
			'before:absolute before:inset-0 before:rounded-[inherit] before:border',
			'before:transition-[border-color] before:ease-effects-fast',
			'before:border-color-outline group-has-hover:before:border-color-on-surface',
			'after:absolute after:inset-0 after:rounded-[inherit] after:border-3 after:opacity-0',
			'after:transition-opacity after:ease-effects-fast',
			'after:border-color-primary group-has-focus:after:opacity-100 group-has-active:after:opacity-100',
		],
		iconClass: 'text-color-on-surface-variant [&_svg]:size-5 [&:not(:has(svg))]:hidden',
		trailingIconClass: 'text-color-on-surface-variant transition-transform ease-effects-fast group-has-open:-scale-y-100',
		labelClass: 'text-start text-color-on-surface',
	},
	variants: {
		size: {
			xs: {
				base: 'h-8 text-sm',
				trailingIconClass: 'size-5',
			},
			sm: {
				base: 'h-10 text-base',
				trailingIconClass: 'size-6',
			},
		},
		full: {
			true: {
				base: 'w-full',
			},
		},
	},
	defaultVariants: {
		size: 'sm',
	},
});

type SelectVariants = VariantProps<typeof selectVariants>;

interface Props extends SelectVariants, Omit<HTMLSelectAttributes, 'size'> {
	value: T
	children: Snippet
	labelIcon?: Snippet
	label?: string
	class?: ClassValue
	hint?: string
}

let {
	value = $bindable(),
	children,
	labelIcon,
	label,
	size,
	class: className,
	onchange,
	hint,
	full,
	...rest
}: Props = $props();

const { base, outline, iconClass, trailingIconClass, labelClass } = selectVariants();
</script>
