{#if store.translated}
	<div class={fontClass}>
		<TranslatedText translated={store.translated} />
	</div>
	{#if storage.settings.showTransliteration}
		<p class="text-sm text-color-on-surface-variant">{store.translated.sentence.translit}</p>
	{/if}
{:else if store.errors.google.length}
	<p class="text-sm text-color-error">
		{store.errors.google.join('\n')}
	</p>
{:else if store.isPending}
	<div class="flex w-full justify-center py-2">
		<Loader class="size-6" />
	</div>
{:else}
	<p class="text-sm text-color-on-surface-variant">
		{browser.i18n.getMessage('popup_placeholder_translation')}
	</p>
{/if}

<script lang="ts">
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/content/store.svelte';
import Loader from '~/lib/Loader.svelte';
import TranslatedText from './lib/TranslatedText/TranslatedText.svelte';
import { getFontClass } from '~/entrypoints/content/utils/fontSizeToClass';

const fontClass = $derived<string>(getFontClass(storage.settings.fontSize));
</script>
