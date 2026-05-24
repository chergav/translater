<div class="h-full min-h-0 rounded-xl bg-color-surface-bright p-1">
	<div class="flex h-full flex-col gap-1">
		<div class="scrollbar overflow-y-auto p-1 wrap-break-word whitespace-pre-line">
			{#if providerStore.isSelectedProviderGoogle || store.isCachedItem}
				<TranslationGoogle />
			{:else}
				<TranslationAi />
			{/if}
			{#if
				storage.settings.sourceLang !== 'auto' &&
				store.translated?.ld_result.srclangs &&
				store.translated?.ld_result.srclangs[0] !== storage.settings.sourceLang}
				<div class="flex items-center gap-1 py-1">
					<span>{browser.i18n.getMessage('popup_original_language')}</span>
					<button
						class="inline-flex text-sm text-blue-600"
						onclick={() => setCorrectSourceLang(store.translated?.ld_result.srclangs[0])}
						type="button"
					>
						{getDisplayedLanguageName(store.translated?.ld_result.srclangs[0])}
					</button>
				</div>
			{/if}
			{#if store.translated?.dict}
				<div class="flex flex-col gap-1 pt-2 text-sm">
					{#each store.translated.dict as dict, index (index)}
						<div>
							<span class="font-medium text-color-primary">{dict.pos}:</span>
							<span class="text-color-on-surface">{dict.terms.join(', ')}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<script lang="ts">
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/content/store.svelte';
import { providerStore } from '~/entrypoints/options/lib/Providers/providerStore.svelte';
import TranslationGoogle from '~/entrypoints/content/lib/PopupFull/lib/TranslationGoogle/TranslationGoogle.svelte';
import TranslationAi from '~/entrypoints/content/lib/PopupFull/lib/TranslationAi.svelte';
import { getDisplayedLanguageName } from '~/shared/languages';

function setCorrectSourceLang(sourceLang?: string) {
	storage.settings.sourceLang = sourceLang || 'auto';
	store.reTranslate();
}
</script>
