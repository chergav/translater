{#if keys && keys.length}
	<p class="text-sm inline-flex items-center">
		{#each keys as key, index (index)}
			{#if index > 0}
				<span class="mx-2">+</span>
			{/if}
			<span
				class="
					px-2
					py-1
					bg-secondary-hover
					border
					border-variant-400-600
					rounded-md
				"
			>{key}</span>
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
