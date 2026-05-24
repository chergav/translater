<main class="flex min-h-40 flex-1 flex-col rounded-xl bg-color-surface-bright">
	<div class="flex min-h-0 flex-col gap-1 p-2">
		<div class="flex shrink-0 items-center justify-between">
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
			<IconButton
				color="standard"
				onclick={toggleOriginalText}
				selected={storage.settings.showOriginalText}
				size="xs"
				title={browser.i18n.getMessage('options_show_original_text')}
				toggle
				width="wide"
			>
				<KeyboardArrowDown
					class={[
						'transition-transform ease-effects-fast',
						storage.settings.showOriginalText && '-scale-y-100',
					]}
				/>
			</IconButton>
		</div>
		{#if storage.settings.showOriginalText}
			<div
				class="flex min-h-0 flex-col whitespace-pre-line"
				transition:slide={{ duration: DURATION }}
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
					<p class="scrollbar overflow-y-auto px-1.5 text-sm text-color-on-surface-variant">
						{store.translated.sentence.src_translit}
					</p>
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

	<div class="mx-3 h-0.5 shrink-0 bg-color-surface-dim"></div>

	<div class="flex min-h-0 flex-col gap-1 p-2">
		<div class="flex shrink-0 items-center justify-between">
			<div class="flex items-center gap-1">
				<SelectLanguage
					onchange={store.reTranslate}
					bind:value={storage.settings.targetLang}
				/>
				<ButtonCopy text={translatedText} />
				<TTS targetLang={storage.settings.targetLang} text={translatedText} />
			</div>
			{#if !providerStore.isSelectedProviderGoogle && store.translationAi}
				{#if store.translationAi.isStreaming}
					<div class="flex items-center gap-1">
						<Loader class="size-6" />
						<IconButton
							color="standard"
							onclick={store.stopTranslation}
							size="xs"
							title="Stop translation"
						>
							<Stop />
						</IconButton>
					</div>
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
			{/if}
		</div>
		<div class="scrollbar min-h-0 overflow-y-auto px-1.5 py-1 wrap-break-word whitespace-pre-line">
			{#if providerStore.isSelectedProviderGoogle || store.isCachedItem}
				<TranslationGoogle />
			{:else}
				<TranslationAi />
			{/if}
		</div>
	</div>
</main>

<script lang="ts">
import { slide } from 'svelte/transition';
import { store } from '~/entrypoints/content/store.svelte';
import { storage } from '~/shared/storage.svelte';
import { providerStore } from '~/entrypoints/options/lib/Providers/providerStore.svelte';
import IconButton from '~/lib/base/IconButton.svelte';
import Loader from '~/lib/Loader.svelte';
import TextareaOrig from './lib/TextareaOrig.svelte';
import TranslationGoogle from './lib/TranslationGoogle/TranslationGoogle.svelte';
import TranslationAi from './lib/TranslationAi.svelte';
import ButtonCopy from './lib/ButtonCopy.svelte';
import TTS from './lib/TTS/TTS.svelte';
import KeyboardArrowDown from '~icons/material-symbols/keyboard-arrow-down-rounded';
import Stop from '~icons/material-symbols/stop-rounded';
import Refresh from '~icons/material-symbols/refresh-rounded';
import SelectLanguage from '~/lib/SelectLanguage/SelectLanguage.svelte';
import { getDisplayedLanguageName } from '~/shared/languages';

const DURATION = $derived<number>(storage.motionDisabled ? 0 : 150);

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
