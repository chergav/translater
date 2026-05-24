{#if store.translationAi}
	{#if store.downloadProgress !== null}
		<p class="text-sm text-color-on-surface-variant">
			Downloading model: {store.downloadProgress}%
		</p>
	{/if}
	<div class={['text-color-on-surface', fontClass]}>
		{store.translationAi.text}
	</div>
	{#if storage.settings.showTransliteration}
		<p class="text-sm text-color-on-surface-variant">{store.translated?.sentence.translit}</p>
	{/if}
{:else}
	<p class="text-color-on-surface-variant">
		{browser.i18n.getMessage('popup_placeholder_translation')}
	</p>
{/if}

{#if store.errors.ai.length}
	<p class="text-sm text-color-error">
		{store.errors.ai.join('\n')}
	</p>
{/if}

<script lang="ts">
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/content/store.svelte';
import { getFontClass } from '~/entrypoints/content/utils/fontSizeToClass';

const fontClass = $derived<string>(getFontClass(storage.settings.fontSize));
</script>
