<span
	class={[
		'inline-flex h-8 items-center gap-1 rounded-lg border border-color-outline-variant pr-1 pl-3 select-none',
		classValue,
	]}
>
	{@render start?.()}
	<span class="text-sm">{content}</span>
	{@render end?.()}
</span>

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
