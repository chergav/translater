<div
	class={[
		'inline-flex items-center rounded-lg border border-color-surface-highest p-1 select-none',
		classValue,
	]}
>
	{@render start?.()}
	<span class="px-2 text-sm">{content}</span>
	{@render end?.()}
</div>

<script lang="ts">
import type { Snippet } from 'svelte';
import type { ClassValue } from 'svelte/elements';

interface Props  {
	content: string
	start?: Snippet
	end?: Snippet
	class?: ClassValue
}

let {
	content,
	start,
	end,
	class: classValue,
}: Props = $props();
</script>
