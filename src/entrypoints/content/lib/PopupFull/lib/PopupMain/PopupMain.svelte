<main class="flex flex-col gap-1 px-1 pb-1">
	<div class="rounded-[16px] bg-color-surface p-1">
		<div class="flex flex-col gap-1">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-1">
					<SelectLanguage auto onchange={reTranslate} bind:value={store.sourceLang} />
					<ButtonCopy text={store.textToTranslate} />
					<TTS targetLang={store.sourceLang} text={store.textToTranslate} />
				</div>
				<Button
					icon={mdiChevronDown}
					iconClass={['transition-transform', originalOpen && '-scale-y-100']}
					onclick={() => {
						originalOpen = !originalOpen;
					}}
					size="xs"
				/>
			</div>
			{#if originalOpen}
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
								onclick={() => {
									store.textToTranslate = store.translated?.spell.spell_res || '';
									reTranslate();
								}}
								type="button"
							>
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html store.translated.spell.spell_html_res}
							</button>
						</div>
					{/if}
					{#if
						store.translated?.ld_result.srclangs &&
						store.translated?.ld_result.srclangs[0] !== store.sourceLang}
						<div class="flex items-center gap-1 p-1">
							<span>{browser.i18n.getMessage('popup_original_language')}</span>
							<button
								class="inline-flex text-sm text-blue-600"
								onclick={() => {
									store.sourceLang = store.translated?.ld_result.srclangs[0] || '';
									reTranslate();
								}}
								type="button"
							>
								{browser.i18n
									// @ts-expect-error ignore messageName
									.getMessage(`language_${store.translated?.ld_result.srclangs[0].replace('-', '_')}`).toLowerCase()}
							</button>
						</div>
					{/if}
					{#if store.translated && storage.settings.showTransliteration}
						<p class="px-1 text-sm text-color-on-surface-variant">{store.translated.sentence.src_translit}</p>
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
						onchange={reTranslate}
						bind:value={storage.settings.targetLang}
					/>
					<ButtonCopy text={translatedText} />
					<TTS targetLang={storage.settings.targetLang} text={translatedText} />
				</div>
				<Button
					icon={mdiChevronDown}
					iconClass={['transition-transform', translationOpen && '-scale-y-100']}
					onclick={() => {
						translationOpen = !translationOpen;
					}}
					size="xs"
				/>
			</div>
			{#if translationOpen}
				<div
					class="scrollbar max-h-80 overflow-y-auto p-1 whitespace-pre-line"
					transition:slide={{ duration: 150 }}
				>
					{#if providerStore.isSelectedProviderGoogle}
						<TranslationGoogle />
					{:else}
						<TranslationAi />
					{/if}
				</div>
			{/if}
		</div>
	</div>
</main>

<script lang="ts">
import { slide } from 'svelte/transition';
import { store } from '~/entrypoints/content/store.svelte';
import { storage } from '~/shared/storage.svelte';
import { providerStore } from '~/entrypoints/options/lib/Providers/providerStore.svelte';
import Button from '~/lib/Button.svelte';
import TextareaOrig from './lib/TextareaOrig.svelte';
import TranslationGoogle from './lib/TranslationGoogle/TranslationGoogle.svelte';
import TranslationAi from './lib/TranslationAi.svelte';
import ButtonCopy from './lib/ButtonCopy.svelte';
import TTS from './lib/TTS/TTS.svelte';
import { mdiChevronDown } from '@mdi/js';
import SelectLanguage from '~/lib/SelectLanguage.svelte';

let	translationOpen = $state<boolean>(true);
let originalOpen = $derived<boolean>(storage.settings.showOriginalText);
const translatedText = $derived<string>(
	providerStore.isSelectedProviderGoogle
		? store.translated?.sentence.trans || ''
		:  store.translationAi?.text || '',
);

function reTranslate() {
	if (store.textToTranslate) {
		store.translate();
	}
}
</script>
