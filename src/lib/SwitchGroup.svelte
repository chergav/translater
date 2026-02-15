<div
	class={[
		'flex shrink-0 flex-col gap-1 overflow-hidden rounded-2xl',
		'[&>label]:w-full [&>label]:p-3',
		'[&>label]:bg-color-surface-container [&>label]:hover:bg-color-surface-high [&>label]:has-active:bg-color-surface-highest',
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
