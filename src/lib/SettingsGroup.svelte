<div
	class={[
		'flex shrink-0 flex-col gap-1 overflow-hidden rounded-2xl',
		'*:w-full *:rounded-sm *:p-3 *:transition-colors *:select-none',
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
