<main class="flex flex-col gap-1 px-1 pb-1">
	<div class="rounded-[16px] bg-color-surface p-1">
		<div class="flex flex-col gap-1">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-1">
					<SelectLanguage
						autoLang
						detectedLang={store.detectedLang}
						onchange={store.reTranslate}
						bind:value={storage.settings.sourceLang}
					/>
					<ButtonCopy text={store.textToTranslate} />
					<TTS
						targetLang={sourceTTSLang}
						text={store.textToTranslate}
					/>
				</div>
				<Button
					icon={mdiChevronDown}
					iconClass={[
						'transition-transform',
						storage.settings.showOriginalText && '-scale-y-100',
					]}
					onclick={toggleOriginalText}
					size="xs"
					title={browser.i18n.getMessage('options_show_original_text')}
				/>
			</div>
			{#if storage.settings.showOriginalText}
				<div
					class="scrollbar max-h-96 overflow-y-auto whitespace-pre-line"
					transition:slide={{ duration: 150 }}
				>
					<TextareaOrig />
					{#if store.translated?.spell?.spell_html_res &&
					store.translated.sentence.orig !== store.translated.spell.spell_res}
						<div class="flex items-center gap-1 p-1">
							<span>{browser.i18n.getMessage('popup_perhaps_you_meant')}</span>
							<button
								class="inline-flex flex-wrap gap-x-1 text-sm text-blue-600"
								onclick={() => setCorrectText(store.translated?.spell.spell_res)}
								type="button"
							>
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html store.translated.spell.spell_html_res}
							</button>
						</div>
					{/if}
					{#if store.translated && storage.settings.showTransliteration}
						<p class="px-1 text-sm text-color-on-surface-variant">{store.translated.sentence.src_translit}</p>
					{/if}
					{#if
						storage.settings.sourceLang !== 'auto' &&
						store.translated?.ld_result.srclangs &&
						store.translated?.ld_result.srclangs[0] !== storage.settings.sourceLang}
						<div class="flex items-center gap-1 p-1">
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
				</div>
			{/if}
		</div>
	</div>
	<div class="rounded-[16px] bg-color-surface p-1">
		<div class="flex flex-col gap-1">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-1">
					<SelectLanguage
						markUILang
						onchange={store.reTranslate}
						bind:value={storage.settings.targetLang}
					/>
					<ButtonCopy text={translatedText} />
					<TTS targetLang={storage.settings.targetLang} text={translatedText} />
				</div>
				{#if !providerStore.isSelectedProviderGoogle && store.translationAi}
					{#if store.translationAi.isStreaming}
						<div class="flex items-center gap-1">
							<Loader />
							<Button
								icon={mdiStop}
								onclick={store.stopTranslation}
								size="xs"
								title="Stop translation"
							/>
						</div>
					{:else}
						<Button
							icon={mdiRefresh}
							onclick={store.reTranslate}
							size="xs"
							title="Retry translation"
						/>
					{/if}
				{/if}
			</div>
			<div class="scrollbar max-h-80 overflow-y-auto p-1 whitespace-pre-line">
				{#if providerStore.isSelectedProviderGoogle}
					<TranslationGoogle />
				{:else}
					<TranslationAi />
				{/if}
			</div>
		</div>
	</div>
</main>

<script lang="ts">
import { slide } from 'svelte/transition';
import { store } from '~/entrypoints/content/store.svelte';
import { storage } from '~/shared/storage.svelte';
import { providerStore } from '~/entrypoints/options/lib/Providers/providerStore.svelte';
import Button from '~/lib/Button.svelte';
import Loader from '~/lib/Loader.svelte';
import TextareaOrig from './lib/TextareaOrig.svelte';
import TranslationGoogle from './lib/TranslationGoogle/TranslationGoogle.svelte';
import TranslationAi from './lib/TranslationAi.svelte';
import ButtonCopy from './lib/ButtonCopy.svelte';
import TTS from './lib/TTS/TTS.svelte';
import { mdiChevronDown, mdiRefresh, mdiStop } from '@mdi/js';
import SelectLanguage from '~/lib/SelectLanguage.svelte';
import { getDisplayedLanguageName } from '~/shared/languages';

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

function toggleOriginalText() {
	storage.settings.showOriginalText = !storage.settings.showOriginalText;
}

function setCorrectText(suggestedText?: string) {
	store.textToTranslate = suggestedText || '';
	store.reTranslate();
}

function setCorrectSourceLang(sourceLang?: string) {
	storage.settings.sourceLang = sourceLang || 'auto';
	store.reTranslate();
}
</script>
