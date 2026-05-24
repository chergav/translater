<div class={list({ class: className })}>
	{@render children?.()}
</div>

<script lang="ts">
import type { Snippet } from 'svelte';
import { tv, type VariantProps, type ClassValue } from 'tailwind-variants';

const list = tv({
	base: 'flex shrink-0 flex-col gap-0.5 overflow-hidden rounded-2xl *:rounded-sm *:bg-color-surface-bright *:px-4 *:py-2.5',
});

type ListVariants = VariantProps<typeof list>;

interface Props extends ListVariants {
	children: Snippet
	class?: ClassValue
}

let {
	children,
	class: className,
}: Props = $props();
</script>
