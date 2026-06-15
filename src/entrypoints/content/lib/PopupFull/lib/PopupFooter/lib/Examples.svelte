{#if store.translated?.examples}
	<div>
		<ul class="flex list-inside list-none flex-col gap-2">
			{#each store.translated?.examples?.example as example, index (index)}
				<div class="flex items-center gap-2">
					<FormatQuoteOutline class="size-5 shrink-0 self-start text-color-on-surface-variant" />
					<li>
						<span
							class={[
								'cursor-pointer rounded-xs text-color-on-surface',
								'hover:bg-color-secondary-container hover:text-color-on-secondary-container',
								'transition-colors ease-effects-fast',
								'outline-color-secondary focus-visible:outline-common',
							]}
							onclick={() => translate(example.text)}
							onkeydown={e => onKeydownHandler(e, example.text)}
							role="button"
							tabindex="0"
						>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html example.text}
						</span>
					</li>
				</div>
			{/each}
		</ul>
	</div>
{/if}

<script lang="ts">
import { store } from '~/entrypoints/content/store.svelte';
import FormatQuoteOutline from '~icons/material-symbols/format-quote-rounded';
import { stripTags } from '~/utils/stripTags';

function translate(text: string) {
	store.textToTranslate = stripTags(text);
	store.translate();
}

function onKeydownHandler(e: KeyboardEvent, text: string) {
	if (e.code === 'Space' || e.code === 'Enter') {
		e.preventDefault();
		translate(text);
	}
}
</script>
