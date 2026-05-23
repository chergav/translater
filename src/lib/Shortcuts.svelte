{#if keys && keys.length}
	<div class="inline-flex items-center text-sm">
		{#each keys as key, index (index)}
			{#if index > 0}
				<span class="mx-2">+</span>
			{/if}
			<span class={['inline-flex h-8 items-center rounded-lg border border-color-outline-variant px-2 font-medium', className]}>
				{key}
			</span>
		{/each}
	</div>
{:else}
	<p class="text-sm text-color-secondary">
		{browser.i18n.getMessage('options_key_combination_is_not_set')}
	</p>
{/if}

<script lang="ts">
import type { ClassValue } from 'svelte/elements';

interface Props {
	keys?: string[]
	class?: ClassValue
}

let {
	keys,
	class: className,
}: Props = $props();
</script>
