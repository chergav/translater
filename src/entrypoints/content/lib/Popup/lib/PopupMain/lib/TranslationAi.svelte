{#if store.translationAi}
	{#if store.translationAi.isStreaming}
		<div class="flex items-center gap-1">
			<Loader />
			<Button
				icon={mdiStop}
				onclick={stopTranslation}
				size="xs"
				title="Stop translation"
			/>
		</div>
	{:else}
		<Button
			icon={mdiRefresh}
			label="Retry"
			onclick={reTranslate}
			size="xs"
		/>
	{/if}
	{#if store.downloadProgress !== null}
		<p class="text-sm text-color-on-surface-variant">
			Downloading model: {store.downloadProgress}%
		</p>
	{/if}
	<div style="font-size: {storage.settings.fontSize}px; line-height: {storage.settings.fontSize * 1.6}px">
		{store.translationAi.text}
	</div>
{:else}
	<p class="text-color-on-surface-variant">
		{browser.i18n.getMessage('popup_placeholder_translation')}
	</p>
{/if}

{#if store.errors.length}
	<p class="text-color-error">
		{store.errors.join(' ')}
	</p>
{/if}

<script lang="ts">
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/content/store.svelte';
import Button from '~/lib/Button.svelte';
import Loader from '~/lib/Loader.svelte';
import { mdiStop, mdiRefresh } from '@mdi/js';

function stopTranslation() {
	store.stopTranslation();
}

function reTranslate() {
	store.translate();
}
</script>
