{#if keys && keys.length}
	<div class="inline-flex items-center text-sm">
		{#each keys as key, index (index)}
			{#if index > 0}
				<span class="mx-2">+</span>
			{/if}
			<span class="inline-flex h-8 items-center rounded-lg border border-color-surface-highest bg-color-surface px-2 font-medium">
				{key}
			</span>
		{/each}
	</div>
{:else}
	<p class="text-sm text-amber-600 dark:text-amber-400">
		{browser.i18n.getMessage('options_key_combination_is_not_set')}
	</p>
{/if}

<script lang="ts">
interface Props {
	keys?: string[]
}

let { keys }: Props = $props();
</script>
