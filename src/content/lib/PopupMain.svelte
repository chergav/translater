{#if !$store.translated}
	<div class="flex justify-center items-center h-[200px] w-full">
		<div
			class="
				animate-spin
				w-8
				h-8
				rounded-full
				border-[3px]
				border-gray-200
				border-r-blue-600
				dark:border-gray-600
				dark:border-r-blue-600
			"
		/>
	</div>
{:else if $store.error}
	<div class="p-2 whitespace-pre-line max-h-96 overflow-y-auto text-sm text-red-500">
		Something went wrong: {$store.error.message}
	</div>
	<!-- eslint-disable-next-line no-unused-vars -->
	{@const l = console.log($store.error)}
{:else}
	<main>
		<div class="mb-1 bg-white dark:bg-gray-900 rounded-[16px]">
			<div class="p-1">
				<div class="flex justify-between leading-[0]">
					<div class="flex gap-1">
						<SelectLanguage
							auto
							bind:value={$store.sourceLang}
							on:change={getTranslate}
						/>
						<ButtonCopy text={$store.translated.sentences.orig} />
						<TTS lang={$store.sourceLang} text={$store.translated.sentences.orig} />
					</div>
					<div class="flex gap-1">
						<ButtonExpand
							expand={originalOpen}
							on:click={() => {
								originalOpen = !originalOpen;
							}}
						/>
					</div>
				</div>
			</div>
			{#if originalOpen}
				<div
					class="p-1 whitespace-pre-line max-h-96 overflow-y-auto scrollbar"
					transition:slide|local={{ duration: 150, easing: cubicInOut }}
				>
					<div class="w-full">
						<TextareaOrig />
					</div>
					{#if $store.translated.spell.spell_html_res &&
						$store.translated.sentences.orig !== $store.translated.spell.spell_res}
						<div class="flex p-1">
							{getMessage('popup_perhaps_you_meant')}
							<span
								class="ml-1 text-sm text-blue-600 cursor-pointer"
								role="button"
								tabindex="0"
								on:click={() => {
									$store.selectedText = $store.translated.spell.spell_res;
								}}
								on:keypress={e => {
									if (e.code === 'Enter' || e.code === 'Space') {
										$store.selectedText = $store.translated.spell.spell_res;
									}
								}}
							><!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html $store.translated.spell.spell_html_res}</span>
						</div>
					{/if}
					{#if $store.translated.ld_result.srclangs[0] !== $store.sourceLang}
						<div class="flex p-1">
							{getMessage('popup_original_language')}
							<span
								class="ml-1 text-sm text-blue-600 cursor-pointer"
								role="button"
								tabindex="0"
								on:click={() => {
									$store.sourceLang = $store.translated.ld_result.srclangs[0];
									getTranslate();
								}}
								on:keypress={e => {
									if (e.code === 'Enter' || e.code === 'Space') {
										$store.sourceLang = $store.translated.ld_result.srclangs[0];
										getTranslate();
									}
								}}
							>{getMessage(`supported_languages_${$store.translated.ld_result.srclangs[0].replace('-', '_')}`).toLowerCase()}</span>
						</div>
					{/if}
					{#if $store.translated.sentences.src_translit && $persistentStore.showTransliteration}
						<div class="mt-2 px-1 text-sm text-gray-500">
							{$store.translated.sentences.src_translit}
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<div class="bg-white dark:bg-gray-900 rounded-[16px]">
			<div class="p-1">
				<div class="flex justify-between leading-[0]">
					<div class="flex gap-1">
						<SelectLanguage
							markUILang
							bind:value={$persistentStore.targetLang}
							on:change={getTranslate}
						/>
						<ButtonCopy text={$store.translated.sentences.trans} />
						<TTS
							lang={$persistentStore.targetLang}
							text={$store.translated.sentences.trans}
						/>
					</div>
					<div class="flex gap-1">
						<ButtonExpand
							expand={translateOpen}
							on:click={() => {
								translateOpen = !translateOpen;
							}}
						/>
					</div>
				</div>
			</div>
			{#if translateOpen}
				<div
					class="relative p-2 whitespace-pre-line max-h-80 overflow-y-auto scrollbar"
					transition:slide|local={{ duration: 150, easing: cubicInOut }}
				>
					<div
						bind:this={elemTrans}
						class={isLongText ? 'text-sm' : 'text-base'}
					>
						{$store.translated.sentences.trans}
					</div>
					{#if $store.pending}
						<div
							class="
								absolute
								top-0
								left-0
								w-full
								h-full
								flex
								justify-center
								items-center
							"
						>
							<div
								class="
									animate-spin
									w-6
									h-6
									rounded-full
									border-[2px]
									border-gray-200
									border-r-blue-600
									dark:border-gray-600
									dark:border-r-blue-600
								"
							/>
						</div>
					{/if}
					{#if $store.translated.sentences.translit && $persistentStore.showTransliteration}
						<div class="mt-2 text-sm text-gray-500">{$store.translated.sentences.translit}</div>
					{/if}
				</div>
			{/if}
		</div>
	</main>
{/if}

<script>
import { afterUpdate } from 'svelte';
import { slide } from 'svelte/transition';
import { cubicInOut } from 'svelte/easing';
import { persistentStore } from '~/common/store';
import { store, getTranslate } from '~/content/store';
import { getMessage } from '~/common/browserApi';
import SelectLanguage from '~/lib/SelectLanguage.svelte';
import TextareaOrig from '~/content/lib/TextareaOrig.svelte';
import ButtonCopy from '~/content/lib/ButtonCopy.svelte';
import TTS from '~/content/lib/TTS.svelte';
import ButtonExpand from '~/content/lib/ButtonExpand.svelte';

let originalOpen = $persistentStore.showOriginalText,
	translateOpen = true,
	elemTrans,
	isLongText;

const getIsLongText = () =>
	elemTrans
		? elemTrans.innerText.length > 150 || elemTrans.innerText.split('\n').length > 2
		: false;

afterUpdate(() => {
	isLongText = getIsLongText();
});
</script>
