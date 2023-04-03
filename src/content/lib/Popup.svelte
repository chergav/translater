{#await promise}
	<div class="flex justify-center items-center h-[146px] w-full">
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
	<div>
		<div class="px-2 pt-2 flex justify-between items-center">
			<div class="w-full flex gap-2">
				<ButtonExpand
					expand={originalOpen}
					on:click={() => {
						originalOpen = !originalOpen;
					}}
				/>
				<Select
					small
					bind:value={sourceLang}
					on:change={handleTranslate}
					{languages}
					auto={true}
				/>
				<ButtonCopy textToCopy={sentences.orig} />
				<ButtonTTS textToSpeech={sentences.orig} langCode={sourceLang} />
			</div>
			<div>
				<ButtonClose
					on:click={() => {
						destroyApp('popup');
					}}
				/>
			</div>
		</div>
		{#if originalOpen}
			<div
				class="p-2 whitespace-pre-line max-h-64 overflow-y-auto scrollbar"
				transition:slide|local={{ duration: 150 }}
			>
				<div class="text-sm">{sentences.orig}</div>
				{#if sentences.src_translit && $persistentStore.showTransliteration}
					<div class="mt-2 text-sm text-gray-500">{sentences.src_translit}</div>
				{/if}
			</div>
			<div class="h-px mx-2 border-0 bg-gray-300 dark:bg-gray-700" />
		{/if}
	</div>

	<div>
		<div class="p-2 flex gap-2">
			<ButtonExpand
				expand={translateOpen}
				on:click={() => {
					translateOpen = !translateOpen;
				}}
			/>
			<Select
				small
				bind:value={$persistentStore.targetLang}
				on:change={handleTranslate}
				{languages}
			/>
			<ButtonCopy textToCopy={sentences.trans} />
			<ButtonTTS textToSpeech={sentences.trans} langCode={targetLang} />
		</div>
		{#if translateOpen}
			<div
				class="px-2 pb-2 whitespace-pre-line max-h-64 overflow-y-auto text-sm scrollbar"
				transition:slide|local={{ duration: 150 }}
			>
				<div class="text-sm">{sentences.trans}</div>
				{#if sentences.translit && $persistentStore.showTransliteration}
					<div class="mt-2 text-sm text-gray-500">{sentences.translit}</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="border-t border-gray-300 dark:border-gray-700">
		<div class="p-2 flex items-center justify-between">
			<div class="flex gap-2">
				{#each tabs as item}
					{#if item.component && translate[item.srcKey]}
						<button
							type="button"
							class="
								hover:bg-gray-200
								rounded-md
								text-sm
								px-2
								py-1
								inline-flex
								items-center
								dark:hover:bg-gray-700
								transition
								{activeTab === item.tab
								? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
								: 'text-gray-500 dark:text-gray-400'}
							"
							on:click={() => {
								tabHandler(item.tab);
							}}
						>
							<span>{item.label}</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 20"
								stroke-width="1.5"
								stroke="currentColor"
								class="
									ml-1
									w-5
									h-5
									{activeTab === item.tab ? 'rotate-180' : ''}
									transition-transform
								"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6 8l4 4 4-4"
								/>
							</svg>
						</button>
					{/if}
				{/each}
			</div>
			<div>
				<a
					href={`https://translate.google.com/?sl=${sourceLang}&tl=${targetLang}&text=${encodeURIComponent(
						sentences.orig
					)}`}
					target="_blank"
					rel="noreferrer"
					class="text-blue-600 visited:text-purple-600 underline"
				>
					<div class="flex items-center">
						<span>Google Translate</span>
						<span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="ml-1 w-5 h-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
								/>
							</svg>
						</span>
					</div>
				</a>
			</div>
		</div>

		<dir class="m-0 p-0">
			{#each tabs as item}
				{#if activeTab === item.tab}
					<div transition:slide|local={{ duration: 250 }}>
						<svelte:component
							this={item.component}
							{translate}
							on:translateWord={handleTranslate}
						/>
					</div>
				{/if}
			{/each}
		</dir>
	</div>
{:catch error}
	<div class="p-2 whitespace-pre-line max-h-96 overflow-y-auto text-sm text-red-500">
		Something went wrong: {error.message}
	</div>
	{@const l = console.log(error)}
{/await}

<script>
import { createEventDispatcher, onMount } from 'svelte';
import { slide } from 'svelte/transition';
import { persistentStore } from '@/common/store';
import { store } from '../store';
import { languages } from '@/common/settings';
import Select from '@/lib/Select.svelte';
import Dictionary from './Dictionary.svelte';
import Definitions from './Definitions.svelte';
import Examples from './Examples.svelte';
import ButtonCopy from './ButtonCopy.svelte';
import ButtonTTS from './ButtonTTS.svelte';
import ButtonExpand from './ButtonExpand.svelte';
import ButtonClose from './ButtonClose.svelte';
import { destroyApp } from '../appsHandler';

const dispatch = createEventDispatcher();

let sourceLang = 'auto',
	targetLang,
	sentences = {},
	translateOpen = true,
	activeTab = 0;

$: originalOpen = $persistentStore.showOriginalText;
// $: $persistentStore.targetLang, handleTranslate({ detail: null });

const getTranslate = async () => {
	targetLang = $persistentStore.targetLang;

	const translate = await chrome.runtime.sendMessage({
		type: 'getTranslate',
		content: {
			sourceLang,
			targetLang,
			selectedText: $store.selectedText,
		},
	});

	sourceLang = sourceLang === 'auto' ? translate.src : sourceLang;

	['trans', 'orig', 'translit', 'src_translit'].forEach(i => {
		sentences[i] = translate.sentences.reduce((a, v) => (a += v[i] ?? ''), '');
	});

	activeTab = 0;

	dispatch('update');

	return translate;
};

let promise = getTranslate();

const handleTranslate = ({ detail }) => {
	if (detail) {
		if ($store.selectedText === detail) {
			return;
		}

		$store.selectedText = detail;
	}

	promise = getTranslate();
};

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
