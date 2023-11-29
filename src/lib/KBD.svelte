{#if keys.length}
	<p
		class="
			text-sm
			[&>span]:inline-block
		"
		>
		{#each keys as key, index}
			<span
				class="
					px-2
					py-1
					bg-gray-100
					dark:bg-gray-800
					border
					border-gray-200
					dark:border-gray-700
					rounded-md
				"
			>{key}</span>
			{#if index !== keys.length - 1}
				<span>+&nbsp;</span>
			{/if}
		{/each}
	</p>
{:else}
	<p class="text-sm text-amber-600 dark:text-amber-400">{getMessage('options_key_combination_is_not_set')}</p>
{/if}

<script>
import { getMessage } from '~/common/browserApi';

export let keys;
</script>
