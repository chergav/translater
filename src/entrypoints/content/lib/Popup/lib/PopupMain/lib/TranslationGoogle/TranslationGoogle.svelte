{#if store.translated}
	<div style="font-size: {storage.settings.fontSize}px; line-height: {storage.settings.fontSize * 1.6}px">
		<TranslatedText translated={store.translated} />
	</div>
	{#if storage.settings.showTransliteration}
		<p class="text-sm text-color-on-surface-variant">{store.translated.sentence.translit}</p>
	{/if}
{:else if store.errors.length}
	<p class="text-color-error">
		Something went wrong: {store.errors.join(' ')}
	</p>
{:else if store.isPending}
	<div class="flex w-full justify-center py-2">
		<Loader />
	</div>
{:else}
	<p class="text-color-on-surface-variant">
		{browser.i18n.getMessage('popup_placeholder_translation')}
	</p>
{/if}

<script lang="ts">
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/content/store.svelte';
import Loader from '~/lib/Loader.svelte';
import TranslatedText from './lib/TranslatedText/TranslatedText.svelte';
</script>
