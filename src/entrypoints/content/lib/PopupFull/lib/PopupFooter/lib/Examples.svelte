{#if store.translated?.examples}
	<div class="mt-1 overflow-hidden rounded-[14px]">
		<div class="scrollbar max-h-96 overflow-y-auto bg-color-surface p-2">
			<ul class="flex list-inside list-none flex-col gap-2">
				{#each store.translated?.examples?.example as example, index (index)}
					<div class="flex gap-2">
						<Icon class="shrink-0 self-start text-color-on-surface-variant" d={mdiFormatQuoteClose} size="20" />
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						<li>{@html example.text}</li>
					</div>
				{/each}
			</ul>
		</div>
	</div>
{/if}

<script lang="ts">
import { store } from '~/entrypoints/content/store.svelte';
import Icon from '~/lib/Icon.svelte';
import { mdiFormatQuoteClose } from '@mdi/js';
</script>
