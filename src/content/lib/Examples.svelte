{#if translate.examples}
	<div class="mt-1 overflow-hidden rounded-[14px]">
		<div
			class="
			p-2
			max-h-96
			overflow-y-auto
			bg-white
			dark:bg-gray-800
			scrollbar
		"
		>
			<ul class="marker:text-gray-500 list-disc pl-5 space-y-3">
				{#each translate.examples.example as entry}
					<li class="mb-2">{@html entry.text}</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}

<script>
export let translate;
</script>
