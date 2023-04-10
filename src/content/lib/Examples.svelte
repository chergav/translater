{#if translate.examples}
	<div class="p-2 max-h-96 overflow-y-auto border-t border-gray-300 dark:border-gray-700 scrollbar">
		<ul class="marker:text-gray-500 list-disc pl-5 space-y-3">
			{#each translate.examples.example as entry}
				<li class="mb-2">{@html entry.text}</li>
			{/each}
		</ul>
	</div>
{/if}

<script>
export let translate;
</script>
