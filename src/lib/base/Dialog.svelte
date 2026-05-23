{#if isOpen}
	<div
		class="pointer-events-none fixed inset-0 z-1 flex bg-color-scrim/32"
		in:fade={{
			duration: DURATION_IN,
			easing: effectsDefault,
		}}
		out:fade={{
			duration: DURATION_OUT,
			easing: effectsDefault,
		}}
	></div>
{/if}
<dialog
	bind:this={dialog}
	oncancel={handleCancel}
	onclick={closeDialog}
	{...rest}
	class={[
		'm-auto flex h-screen w-screen items-center justify-center p-0 [&:not([open])]:hidden',
		'bg-transparent outline-none backdrop:bg-transparent',
	]}
>
	{#if isOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class={[
				'flex size-fit min-h-36 max-w-xl min-w-72 flex-col gap-4 p-6',
				'rounded-28 bg-color-surface-container-high shadow-md',
			]}
			onclick={e => e.stopPropagation()}
			role="dialog"
			tabindex="-1"
			in:fly={{
				y: 20,
				duration: DURATION_IN,
				easing: expressiveSpatialDefault,
			}}
			out:fly={{
				y: 20,
				duration: DURATION_OUT,
				easing: effectsDefault,
			}}
		>
			{#if icon}
				<div class="flex justify-center text-color-secondary [&_svg]:size-6" aria-hidden="true">
					{@render icon()}
				</div>
			{/if}
			{#if headline}
				<h2
					class={[
						'flex gap-2 text-2xl text-color-on-surface',
						icon && 'justify-center',
					]}
				>
					{@render headline()}
				</h2>
			{/if}
			{#if supportingText}
				<div class="flex text-sm text-color-on-surface-variant">
					{@render supportingText()}
				</div>
			{/if}
			{#if children}
				<div class="flex text-color-on-surface">
					{@render children()}
				</div>
			{/if}
			{#if actions}
				<div class="flex justify-end gap-2 pt-1">
					{@render actions()}
				</div>
			{/if}
		</div>
	{/if}
</dialog>

<script lang="ts">
import { type Snippet } from 'svelte';
import type { HTMLDialogAttributes } from 'svelte/elements';
import { fade, fly } from 'svelte/transition';
import { expressiveSpatialDefault, effectsDefault } from './utils/md3Easing';

interface Props extends HTMLDialogAttributes {
	icon?: Snippet
	headline?: Snippet
	supportingText?: Snippet
	children?: Snippet;
	actions?: Snippet
	onClose?: () => void
	quick?: boolean
}

let {
	open = $bindable(false),
	icon,
	headline,
	supportingText,
	children,
	actions,
	onClose,
	quick = false,
	...rest
}: Props = $props();

let isOpen = $state(false);
let dialog = $state<HTMLDialogElement | null>(null);
const DURATION_IN = $derived<number>(quick ? 0 : 500);
const DURATION_OUT = $derived<number>(quick ? 0 : 200);

function showDialog() {
	dialog?.showModal();
	isOpen = true;
}

function closeDialog() {
	if (!isOpen) return;

	isOpen = false;
	open = false;
	onClose?.();
	setTimeout(() => dialog?.close(), DURATION_OUT);
}

function handleCancel(e: Event) {
	e.preventDefault();
	closeDialog();
}

$effect(() => {
	if (open) {
		showDialog();
	} else {
		closeDialog();
	}
});
</script>
