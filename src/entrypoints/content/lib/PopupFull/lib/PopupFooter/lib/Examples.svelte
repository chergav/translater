{#if store.translated?.examples}
	<div class="scrollbar max-h-96 overflow-y-auto p-1">
		<ul class="flex list-inside list-none flex-col gap-2">
			{#each store.translated?.examples?.example as example, index (index)}
				<div class="flex items-center gap-2">
					<span>
						<Icon
							class="shrink-0 text-color-on-surface-variant"
							d={mdiFormatQuoteClose} size="18"
						/>
					</span>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<li>{@html example.text}</li>
				</div>
			{/each}
		</ul>
	</div>
{/if}

<script lang="ts">
import { store } from '~/entrypoints/content/store.svelte';
import Icon from '~/lib/Icon.svelte';
import { mdiFormatQuoteClose } from '@mdi/js';
</script>
