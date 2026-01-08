<div class="flex w-full flex-col gap-1 text-sm">
	<label class="flex flex-col gap-1">
		{#if label}
			<span class={['inline-flex items-center gap-0.5', error && 'text-color-error/100']}>
				{label}
				{#if required}
					<span class="text-color-error">*</span>
				{/if}
			</span>
		{/if}
		<input
			class={[
				'w-full rounded-md bg-color-surface-high px-4 py-2 text-base',
				'placeholder:text-color-outline focus-visible:outline-custom',
				'disabled:cursor-not-allowed disabled:bg-color-surface-container disabled:text-color-on-surface-variant',
				error ? 'focus-visible:outline-color-error' : 'focus-visible:outline-color-primary',
			]}
			onblur={handlerOnblur}
			onfocus={handlerOnfocus}
			{oninput}
			{onkeydown}
			{placeholder}
			{type}
			bind:value
			use:elementFocus={focus}
			{...rest}
		>
	</label>
	{#if error}
		<p class="text-color-error/100">{error}</p>
	{/if}
	{#if hint}
		<p class="text-color-on-surface-variant">{hint}</p>
	{/if}
	{#if hiddenHint && showHiddenHint}
		<p
			class="text-color-on-surface-variant"
			transition:slide={{ duration: 150 }}
		>{hiddenHint}</p>
	{/if}
</div>

<script lang="ts">
import type { HTMLInputAttributes } from 'svelte/elements';
import { slide } from 'svelte/transition';
import { elementFocus } from '~/utils/elementFocus.svelte';

interface Props extends HTMLInputAttributes {
	value: string
	label?: string
	error?: string
	focus?: boolean
	hint?: string
	hiddenHint?: string
}

let {
	value = $bindable(),
	label = '',
	error = '',
	placeholder,
	focus = false,
	hint,
	hiddenHint,
	type = 'text',
	required,
	oninput,
	onblur,
	...rest
}: Props = $props();

let showHiddenHint = $state<boolean>(false);

function onkeydown(event: KeyboardEvent) {
	const target = event.target as HTMLInputElement;

	if (event.key === 'Enter') {
		target.blur();
	}
}

function handlerOnfocus() {
	showHiddenHint = true;
}

function handlerOnblur(event: FocusEvent & { currentTarget: EventTarget & HTMLInputElement; }) {
	showHiddenHint = false;
	onblur?.(event);
}
</script>
