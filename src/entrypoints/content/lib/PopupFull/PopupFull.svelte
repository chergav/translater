<main
	class={[
		'flex min-h-0 flex-1 rounded-xl bg-color-surface-bright',
		!isHoriz && 'flex-col',
	]}>
	<div class={['flex min-h-0 flex-col gap-1 p-1', isHoriz && 'flex-1']}>
		<div class="flex shrink-0 items-center justify-between">
			<div class="flex items-center gap-1">
				<SelectLanguage
					autoLang
					detectedLang={store.detectedLang}
					layout={storage.settings.popupLayout}
					onchange={store.reTranslate}
					bind:value={storage.settings.sourceLang}
				/>
				<ButtonCopy text={store.textToTranslate} />
				<TTS
					targetLang={sourceTTSLang}
					text={store.textToTranslate}
				/>
			</div>
		</div>
		<div class="flex h-full min-h-0 flex-col whitespace-pre-line">
			<TextareaOrig />
			{#if store.translated?.spell?.spell_html_res &&
			store.translated.sentence.orig !== store.translated.spell.spell_res}
				<div class="flex items-center gap-1 p-1">
					<span class="text-sm text-color-on-surface-variant">
						{browser.i18n.getMessage('popup_perhaps_you_meant')}
					</span>
					<button
						class="inline-flex flex-wrap gap-x-1 text-start text-sm text-color-primary"
						onclick={() => setCorrectText(store.translated?.spell.spell_res)}
						type="button"
					>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html store.translated.spell.spell_html_res}
					</button>
				</div>
			{/if}
			{#if store.translated && storage.settings.showTransliteration}
				<p class="scrollbar max-h-64 shrink-0 overflow-y-auto px-1.5 text-sm text-color-on-surface-variant">
					{store.translated.sentence.src_translit}
				</p>
			{/if}
			{#if
				storage.settings.sourceLang !== 'auto' &&
				store.translated?.ld_result.srclangs &&
				store.translated?.ld_result.srclangs[0] !== storage.settings.sourceLang}
				<div class="flex items-center gap-1 p-1">
					<span class="text-sm text-color-on-surface-variant">
						{browser.i18n.getMessage('popup_original_language')}
					</span>
					<button
						class="inline-flex text-sm text-color-primary"
						onclick={() => setCorrectSourceLang(store.translated?.ld_result.srclangs[0])}
						type="button"
					>
						{getDisplayedLanguageName(store.translated?.ld_result.srclangs[0])}
					</button>
				</div>
			{/if}
		</div>
	</div>

	<div
		class={[
			'shrink-0 bg-color-surface-dim',
			isHoriz ? 'my-2 w-0.5' : 'mx-2 h-0.5',
		]}
	></div>

	<div class={['flex min-h-0 flex-col gap-1 p-1', isHoriz && 'flex-1']}>
		<div class="flex shrink-0 items-center justify-between">
			<div class="flex items-center gap-1">
				<SelectLanguage
					layout={storage.settings.popupLayout}
					onchange={store.reTranslate}
					bind:value={storage.settings.targetLang}
				/>
				<ButtonCopy text={translatedText} />
				<TTS targetLang={storage.settings.targetLang} text={translatedText} />
			</div>
		</div>
		<div
			class={[
				'scrollbar min-h-0 overflow-y-auto pl-1.5 wrap-break-word whitespace-pre-line',
				isHoriz ? 'py-2' : 'py-1',
			]}
		>
			{#if providerStore.isSelectedProviderGoogle || store.isCachedItem}
				<TranslationGoogle />
			{:else}
				<TranslationAi />
			{/if}
		</div>
	</div>
</main>

<script lang="ts">
import { PopupLayout } from '~/types';
import { store } from '~/entrypoints/content/store.svelte';
import { storage } from '~/shared/storage.svelte';
import { providerStore } from '~/entrypoints/options/lib/Providers/providerStore.svelte';
import TextareaOrig from './lib/TextareaOrig.svelte';
import TranslationGoogle from './lib/TranslationGoogle/TranslationGoogle.svelte';
import TranslationAi from './lib/TranslationAi.svelte';
import ButtonCopy from './lib/ButtonCopy.svelte';
import TTS from './lib/TTS/TTS.svelte';
import SelectLanguage from '~/lib/SelectLanguage/SelectLanguage.svelte';
import { getDisplayedLanguageName } from '~/shared/languages';

const isHoriz = $derived<boolean>(storage.settings.popupLayout === PopupLayout.Horiz);

const translatedText = $derived<string>(
	providerStore.isSelectedProviderGoogle
		? store.translated?.sentence.trans || ''
		:  store.translationAi?.text || '',
);

const sourceTTSLang = $derived<string>(
	storage.settings.sourceLang === 'auto' && store.detectedLang ?
		store.detectedLang :
		storage.settings.sourceLang,
);

function setCorrectText(suggestedText?: string) {
	store.textToTranslate = suggestedText || '';
	store.reTranslate();
}

function setCorrectSourceLang(sourceLang?: string) {
	storage.settings.sourceLang = sourceLang || 'auto';
	store.reTranslate();
}
</script>
