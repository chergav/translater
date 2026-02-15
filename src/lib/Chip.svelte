<div class="inline-flex items-center rounded-lg border border-color-surface-highest p-1 select-none">
	{@render start?.()}
	<span class="px-2 text-sm">{content}</span>
	{@render end?.()}
</div>

<script lang="ts">
import type { Snippet } from 'svelte';

interface Props  {
	content: string
	start?: Snippet
	end?: Snippet
}

let {
	content,
	start,
	end,
}: Props = $props();
</script>
