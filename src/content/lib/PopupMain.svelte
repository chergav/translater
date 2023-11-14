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
		<div class="mb-1 bg-white dark:bg-gray-900 rounded-[16px] overflow-hidden">
			<div class="p-1">
				<div class="flex justify-between">
					<div class="flex gap-1">
						<SelectLang
							auto
							{languages}
							round
							small
							bind:value={$store.sourceLang}
							on:change={getTranslate}
						/>
						<ButtonCopy text={$store.translated.sentences.orig} />
						<ButtonTTS lang={$store.sourceLang} text={$store.translated.sentences.orig} />
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
					<div class="w-full flex items-start justify-between">
						<TextareaOrig />
					</div>
					{#if $store.translated.sentences.src_translit && $persistentStore.showTransliteration}
						<div class="mt-2 text-sm text-gray-500">
							{$store.translated.sentences.src_translit}
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<div class="bg-white dark:bg-gray-900 rounded-[16px] overflow-hidden">
			<div class="p-1">
				<div class="flex justify-between">
					<div class="flex gap-1">
						<SelectLang
							{languages}
							round
							small
							bind:value={$persistentStore.targetLang}
							on:change={getTranslate}
						/>
						<ButtonCopy text={$store.translated.sentences.trans} />
						<ButtonTTS
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
					class="p-2 whitespace-pre-line max-h-80 overflow-y-auto scrollbar"
					transition:slide|local={{ duration: 150, easing: cubicInOut }}
				>
					<div
						bind:this={elemTrans}
						class={isLongText ? 'text-sm' : 'text-base'}
					>
						{$store.pending
							? $store.translated.sentences.trans + '...'
							: $store.translated.sentences.trans}
						<!-- {$store.translated.sentences.trans} -->
					</div>
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
import { languages } from '~/common/settings';
import SelectLang from '~/lib/SelectLang.svelte';
import TextareaOrig from '~/content/lib/TextareaOrig.svelte';
import ButtonCopy from './ButtonCopy.svelte';
import ButtonTTS from './ButtonTTS.svelte';
import ButtonExpand from './ButtonExpand.svelte';

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
