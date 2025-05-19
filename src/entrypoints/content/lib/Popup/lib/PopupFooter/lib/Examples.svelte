{#if store.translated?.examples}
	<div class="mt-1 overflow-hidden rounded-[14px]">
		<div
			class="
				p-2
				max-h-96
				overflow-y-auto
				bg-surface
				scrollbar
			"
		>
			<ul class="flex flex-col gap-2 list-none list-inside">
				{#each store.translated?.examples?.example as example, index (index)}
					<div class="flex gap-2">
						<Icon class="self-start shrink-0 text-secondary" d={mdiFormatQuoteClose} size="20" />
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
