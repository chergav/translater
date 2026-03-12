<div
	class={[
		'flex shrink-0 flex-col gap-0.5 overflow-hidden rounded-[20px]',
		'*:w-full *:rounded-sm *:px-4 *:py-2 *:transition-colors *:select-none',
		'*:bg-color-surface-container *:hover:bg-color-surface-high',
		'[&>label:not(.ignore-active)]:has-active:bg-color-surface-highest',
	]}
>
	{@render children?.()}
</div>

<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
	children: Snippet
}

let {
	children,
}: Props = $props();
</script>
