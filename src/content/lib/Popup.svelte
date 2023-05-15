<PopupHeader />
{#await $store.translated}
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
{:then translate}
	<main>
		<div class="px-2 pt-2 flex gap-2">
			<ButtonExpand
				expand={originalOpen}
				on:click={() => {
					originalOpen = !originalOpen;
				}}
			/>
			<SelectLang
				small
				auto
				bind:value={$store.sourceLang}
				on:change={handleTranslate}
				{languages}
			/>
			<ButtonCopy text={translate.sentences.orig} />
			<ButtonTTS text={translate.sentences.orig} lang={$store.sourceLang} />
		</div>
		{#if originalOpen}
			<div
				class="p-2 whitespace-pre-line max-h-64 overflow-y-auto scrollbar"
				transition:slide|local={{ duration: 150 }}
			>
				<div class="text-sm">{translate.sentences.orig}</div>
				{#if translate.sentences.src_translit && $persistentStore.showTransliteration}
					<div class="mt-2 text-sm text-gray-500">{translate.sentences.src_translit}</div>
				{/if}
			</div>
			<div class="h-px mx-2 border-0 bg-gray-300 dark:bg-gray-700" />
		{/if}

		<div class="p-2 flex gap-2">
			<ButtonExpand
				expand={translateOpen}
				on:click={() => {
					translateOpen = !translateOpen;
				}}
			/>
			<SelectLang
				small
				bind:value={$persistentStore.targetLang}
				on:change={handleTranslate}
				{languages}
			/>
			<ButtonCopy text={translate.sentences.trans} />
			<ButtonTTS text={translate.sentences.trans} lang={$persistentStore.targetLang} />
		</div>
		{#if translateOpen}
			<div
				class="px-2 pb-2 whitespace-pre-line max-h-64 overflow-y-auto text-sm scrollbar"
				transition:slide|local={{ duration: 150 }}
			>
				<div class="text-sm">{translate.sentences.trans}</div>
				{#if translate.sentences.translit && $persistentStore.showTransliteration}
					<div class="mt-2 text-sm text-gray-500">{translate.sentences.translit}</div>
				{/if}
			</div>
		{/if}
	</main>

	<footer class="border-t border-gray-300 dark:border-gray-700">
		<div class="p-2 flex items-center justify-between">
			<div class="flex gap-2">
				{#each tabs as item}
					{#if item.component && translate[item.srcKey]}
						<TabFlat
							small
							active={activeTab === item.tab}
							label={item.label}
							on:click={() => {
								tabHandler(item.tab);
							}}
						>
							<Icon
								d={heroChevronDown}
								size="sm"
								class="
									ml-1
									{activeTab === item.tab ? 'rotate-180' : ''}
									transition-transform
								"
							/>
						</TabFlat>
					{/if}
				{/each}
			</div>
			<div>
				<a
					href={`https://translate.google.com/?
						sl=${$store.sourceLang}&
						tl=${$persistentStore.targetLang}&
						text=${encodeURIComponent(translate.sentences.orig)}`}
					target="_blank"
					rel="noreferrer"
					class="text-blue-600 visited:text-purple-600 underline"
				>
					<div class="flex items-center">
						<span>Google Translate</span>
						<span>
							<Icon d={heroArrowTopRightOnSquare} class="ml-1" />
						</span>
					</div>
				</a>
			</div>
		</div>

		<dir class="m-0 p-0">
			{#each tabs as item}
				{#if activeTab === item.tab}
					<div transition:slide|local={{ duration: 250 }}>
						<svelte:component this={item.component} {translate}	/>
					</div>
				{/if}
			{/each}
		</dir>
	</footer>
{:catch error}
	<div class="p-2 whitespace-pre-line max-h-96 overflow-y-auto text-sm text-red-500">
		Something went wrong: {error.message}
	</div>
	{@const l = console.log(error)}
{/await}

<script>
import { createEventDispatcher, onMount } from 'svelte';
import { slide } from 'svelte/transition';
import { persistentStore } from '~/common/store';
import { store, selectedText } from '../store';
import { languages } from '~/common/settings';
import PopupHeader from './PopupHeader.svelte';
import SelectLang from '~/lib/SelectLang.svelte';
import TabFlat from '~/lib/TabFlat.svelte';
import Dictionary from './Dictionary.svelte';
import Definitions from './Definitions.svelte';
import Examples from './Examples.svelte';
import ButtonCopy from './ButtonCopy.svelte';
import ButtonTTS from './ButtonTTS.svelte';
import ButtonExpand from './ButtonExpand.svelte';
import { historyAdd } from '~/common/history';
import Icon from '~/lib/Icon.svelte';
import { heroChevronDown, heroArrowTopRightOnSquare } from '@icons/heroicons';

const dispatch = createEventDispatcher();

let translateOpen = true,
	activeTab = 0;

$: originalOpen = $persistentStore.showOriginalText;

const fetchTranslate = async (sourceLang, targetLang, selectedText) => {
	try {
		const content = {
			sourceLang,
			targetLang,
			selectedText
		};

		const response = await chrome.runtime.sendMessage({
			type: 'getTranslate',
			content
		});

		return response;
	} catch (error) {
		console.error('Error occurred while fetching translation: ', error);
		throw error;
	}
};

const getTranslate = async () => {
	const sentences = {};
    const targetLang = $persistentStore.targetLang;
    const selectedText = $store.selectedText;
    const sourceLang = $store.sourceLang;

	const cached = $store.cacheTranslate.find(i =>
		i.sentences.orig === selectedText &&
		i.targetLang === targetLang &&
		i.src === sourceLang
	);

	let translate;

	if (cached) {
		translate = cached;
		$store.sourceLang = cached.src;
		$persistentStore.targetLang = cached.targetLang;
	} else {
		translate = await fetchTranslate(sourceLang, targetLang, selectedText);

		['orig', 'trans', 'translit', 'src_translit'].forEach(i => {
			sentences[i] = translate.sentences.reduce((a, v) => (a += v[i] ?? ''), '');
		});

		$store.sourceLang = $store.sourceLang === 'auto' ? translate.src : $store.sourceLang;

		translate.sentences = sentences;
		translate.targetLang = targetLang;

		$store.cacheTranslate = [...$store.cacheTranslate, translate];

		historyAdd({
			sourceLang: $store.sourceLang,
			targetLang,
			orig: sentences.orig,
			trans: sentences.trans
		});
	}

	return translate;
};

const handleTranslate = () => {
	$store.translated = getTranslate();
};

$: if ($selectedText) handleTranslate();

const tabs = [
	{ tab: 0, srcKey: false, label: '', component: false },
	{
		tab: 1,
		srcKey: 'dict',
		label: chrome.i18n.getMessage('popup_dictionary'),
		component: Dictionary,
	},
	{
		tab: 2,
		srcKey: 'definitions',
		label: chrome.i18n.getMessage('popup_definitions'),
		component: Definitions,
	},
	{
		tab: 3,
		srcKey: 'examples',
		label: chrome.i18n.getMessage('popup_examples'),
		component: Examples,
	},
];

const tabHandler = tab => {
	activeTab = activeTab === tab ? 0 : tab;
};

onMount(() => {
	dispatch('update');
});
</script>
