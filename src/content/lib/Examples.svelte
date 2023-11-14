{#if $store.translated.examples}
	<div class="mt-1 overflow-hidden rounded-[14px]">
		<div
			class="
			p-2
			max-h-96
			overflow-y-auto
			bg-white
			dark:bg-gray-900
			scrollbar
		"
		>
			<ul class="marker:text-gray-500 list-disc pl-5 space-y-3">
				{#each $store.translated.examples.example as entry}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<li class="mb-2 last:mb-0">{@html entry.text}</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}

<script>
import { store } from '~/content/store';
</script>
