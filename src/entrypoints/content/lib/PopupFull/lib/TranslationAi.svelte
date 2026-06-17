{#if store.translationAi}
	<div class="flex w-full justify-between">
		<div class="flex flex-col">
			{#if store.downloadProgress !== null}
				<p class="text-sm text-color-on-surface-variant">
					Downloading model: {store.downloadProgress}%
				</p>
			{/if}
			<div class={['text-color-on-surface', fontClass]}>
				{store.translationAi.text}
			</div>
		</div>
		<div class="relative -mt-1 flex size-fit shrink-0 items-center justify-center overflow-hidden">
			{#if store.translationAi.isStreaming}
				<Loader class="absolute size-8" />
				<IconButton
					color="standard"
					onclick={store.stopTranslation}
					size="xs"
					title="Stop translation"
				>
					<Stop />
				</IconButton>
			{:else}
				<IconButton
					color="standard"
					onclick={store.reTranslateIgnoreCache}
					size="xs"
					title="Retry translation"
				>
					<Refresh />
				</IconButton>
			{/if}
		</div>
	</div>
{:else}
	<p class="text-sm text-color-on-surface-variant">
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
import IconButton from '~/lib/base/IconButton.svelte';
import Loader from '~/lib/Loader.svelte';
import Stop from '~icons/material-symbols/stop-rounded';
import Refresh from '~icons/material-symbols/refresh-rounded';

const fontClass = $derived<string>(getFontClass(storage.settings.fontSize));
</script>
