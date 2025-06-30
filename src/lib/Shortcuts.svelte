{#if keys && keys.length}
	<p class="inline-flex items-center text-sm">
		{#each keys as key, index (index)}
			{#if index > 0}
				<span class="mx-2">+</span>
			{/if}
			<span class="rounded-md border border-color-outline-variant bg-color-surface-high px-2 py-1">
				{key}
			</span>
		{/each}
	</p>
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
