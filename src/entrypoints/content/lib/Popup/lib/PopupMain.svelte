<main class="flex flex-col gap-1">
	<div class="p-1 bg-surface rounded-[16px] whitespace-pre-line">
		<div class="flex flex-col gap-1">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-1">
					<SelectLanguage auto onchange={getTranslate} bind:value={store.sourceLang} />
					<ButtonCopy text={store.translated?.sentence.orig || ''} />
					<TTS lang={store.sourceLang} text={store.translated?.sentence.orig || ''} />
				</div>
				<Button
					icon={mdiChevronDown}
					iconClass={originalOpen ? 'transform -scale-y-100' : ''}
					iconSize="20"
					onclick={() => {
						originalOpen = !originalOpen;
					}}
					small
				/>
			</div>
			{#if originalOpen}
				<div
					class="whitespace-pre-line max-h-96 overflow-y-auto scrollbar"
					transition:slide={{ duration: 150 }}
				>
					<TextareaOrig />
					{#if store.translated?.spell?.spell_html_res &&
						store.translated.sentence.orig !== store.translated.spell.spell_res}
						<div class="p-1 flex items-center">
							{browser.i18n.getMessage('popup_perhaps_you_meant')}
							<span
								class="ml-1 text-sm text-blue-600 cursor-pointer"
								onclick={() => {
									store.textToTranslate = store.translated?.spell.spell_res || '';
									getTranslate();
								}}
								onkeypress={e => {
									if (e.code === 'Enter' || e.code === 'Space') {
										store.textToTranslate = store.translated?.spell.spell_res || '';
										getTranslate();
									}
								}}
								role="button"
								tabindex="0"
							><!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html store.translated.spell.spell_html_res}</span>
						</div>
					{/if}
					{#if
						store.translated?.ld_result.srclangs &&
						store.translated?.ld_result.srclangs[0] !== store.sourceLang}
						<div class="p-1 flex items-center">
							{browser.i18n.getMessage('popup_original_language')}
							<span
								class="ml-1 text-sm text-blue-600 cursor-pointer"
								onclick={() => {
									store.sourceLang = store.translated?.ld_result.srclangs[0] || '';
									getTranslate();
								}}
								onkeypress={e => {
									if (e.code === 'Enter' || e.code === 'Space') {
										store.sourceLang = store.translated?.ld_result.srclangs[0] || '';
										getTranslate();
									}
								}}
								role="button"
								tabindex="0"
							>
							{browser.i18n
								// @ts-expect-error ignore messageName
								.getMessage(`language_${store.translated?.ld_result.srclangs[0].replace('-', '_')}`).toLowerCase()}
							</span>
						</div>
					{/if}
					{#if store.translated && storage.settings.showTransliteration}
						<p class="px-1 text-secondary text-sm">{store.translated.sentence.src_translit}</p>
					{/if}
				</div>
			{/if}
		</div>
	</div>
	<div class="p-1 bg-surface rounded-[16px]">
		<div class="flex flex-col gap-1">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-1">
					<SelectLanguage
						markUILang
						onchange={getTranslate}
						bind:value={storage.settings.targetLang}
					/>
					<ButtonCopy text={store.translated?.sentence.trans || ''} />
					<TTS lang={storage.settings.targetLang} text={store.translated?.sentence.trans || ''} />
				</div>
				<Button
					icon={mdiChevronDown}
					iconClass={translateOpen ? 'transform -scale-y-100' : ''}
					iconSize="20"
					onclick={() => {
						translateOpen = !translateOpen;
					}}
					small
				/>
			</div>
			{#if translateOpen}
				<div
					class="p-1 whitespace-pre-line max-h-80 overflow-y-auto scrollbar"
					transition:slide={{ duration: 150 }}
				>
					{#if store.translated}
						<TranslatedText />
						{#if storage.settings.showTransliteration}
							<p class="text-secondary text-sm">{store.translated.sentence.translit}</p>
						{/if}
					{:else if store.errors.length}
						<p class="text-red-600 dark:text-red-400">
							Something went wrong: {store.errors.join(' ')}
						</p>
					{:else if store.isPending}
						<div class="py-2 w-full flex justify-center">
							<Loader />
						</div>
					{:else}
						<p class="text-secondary">
							{browser.i18n.getMessage('popup_placeholder_translation')}
						</p>
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
import Button from '~/lib/Button.svelte';
import Loader from '~/lib/Loader.svelte';
import TextareaOrig from './TextareaOrig.svelte';
import TranslatedText from './TranslatedText/TranslatedText.svelte';
import ButtonCopy from './ButtonCopy.svelte';
import TTS from './TTS.svelte';
import { mdiChevronDown } from '@mdi/js';
import SelectLanguage from '~/lib/SelectLanguage.svelte';

let originalOpen = $derived<boolean>(storage.settings.showOriginalText);
let	translateOpen = $state<boolean>(true);

function getTranslate() {
	if (store.textToTranslate) {
		store.getTranslate();
	}
}
</script>
