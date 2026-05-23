<li
	class={[
		'group relative flex h-8 min-w-40 shrink-0 cursor-pointer rounded-sm px-3',
		'outline-color-secondary focus-visible:outline-menu',
		'[&_svg]:pointer-events-none [&_svg]:shrink-0',
		'aria-disabled:pointer-events-none aria-disabled:opacity-disabled',
		'aria-selected:rounded-xl aria-selected:bg-color-tertiary-container',
	]}
	aria-disabled={disabled}
	aria-selected={selected}
	onclick={onClickHandler}
	onkeydown={onKeydownHandler}
	role="option"
	tabindex="-1"
>
	<span
		class={[
			'pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity ease-effects-fast',
			'group-hover:opacity-hover group-focus-visible:opacity-pressed group-active:opacity-pressed group-aria-disabled:opacity-pressed',
			'bg-color-on-surface group-aria-selected:bg-color-on-tertiary-container',
		]}
	></span>
	<div class="relative flex w-full items-center gap-2">
		{#if leadingIcon}
			<span
				class={[
					'[&_svg]:size-5 [&:not(:has(svg))]:hidden',
					'text-color-on-surface-variant group-aria-selected:text-color-on-tertiary-container',
				]}
			>
				{@render leadingIcon(selected)}
			</span>
		{/if}
		<span
			class={[
				'flex-1 text-sm font-medium whitespace-nowrap',
				'text-color-on-surface group-aria-selected:text-color-on-tertiary-container',
			]}
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html label}
		</span>
		{#if trailingIcon}
			<span
				class={[
					'[&_svg]:size-5 [&:not(:has(svg))]:hidden',
					'text-color-on-surface-variant group-aria-selected:text-color-on-tertiary-container',
				]}
			>
				{@render trailingIcon(selected)}
			</span>
		{/if}
	</div>
</li>

<script lang="ts">
import { type Snippet } from 'svelte';
import { getListboxCtx } from './context';

interface Props {
	value: string
	label: string
	leadingIcon?: Snippet<[selected?: boolean]>
	trailingIcon?: Snippet<[selected?: boolean]>
	disabled?: boolean
	keepOpen?: boolean
}

let {
	value,
	label,
	leadingIcon,
	trailingIcon,
	disabled,
	keepOpen,
}: Props = $props();

const listboxCtx = getListboxCtx();
const selected = $derived<boolean>(value === listboxCtx.value);

function onClickHandler() {
	listboxCtx.value = value;
	if (!keepOpen) listboxCtx.closeWithFocus();
}

function onKeydownHandler(e: KeyboardEvent) {
	if (e.code === 'Space' || e.code === 'Enter') {
		e.preventDefault();
		onClickHandler();
	}
}
</script>
