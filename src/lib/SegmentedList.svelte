<div
	class={[
		'flex shrink-0 flex-col gap-0.5 overflow-hidden rounded-2xl',
		'*:w-full *:rounded-sm *:px-4 *:py-2.5 *:transition-[background-color,border-radius] *:select-none',
		'*:bg-color-surface-container *:hover:bg-color-surface-high',
		expressive ?
			[
				'[&>label]:has-checked:rounded-2xl',
				'[&>label:not(.ignore-active)]:not-has-checked:has-active:bg-color-surface-highest',
				'[&>label:not(.ignore-active)]:has-checked:has-active:bg-color-primary/20',
				'[&>label]:has-checked:bg-color-primary/15',
			] :
			'[&>label:not(.ignore-active)]:has-active:bg-color-surface-highest',
	]}
>
	{@render children?.()}
</div>

<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
	expressive?: boolean
	children: Snippet
}

let {
	expressive = false,
	children,
}: Props = $props();
</script>
