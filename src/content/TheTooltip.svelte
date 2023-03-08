<header class="p-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
	<div class="flex items-center">
		<Select bind:value={sourceLang} on:change={handleTranslate} {languages} auto={true} />
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="inline-block w-5 h-5 mx-1"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
			/>
		</svg>

		<Select bind:value={$persistentStore.targetLang} on:change={handleTranslate} {languages} />
	</div>
	<div>
		<button
			type="button"
			id="close-tooltip"
			class="
				bg-transparent
				text-gray-500
				hover:bg-gray-200
				hover:text-gray-900
				rounded-full
				p-1
				ml-auto
				inline-flex
				items-center
				dark:hover:bg-gray-700
				dark:text-gray-400
				dark:hover:text-white
				transition
			"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-5 h-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
</header>

<main>
	{#await promise}
		<div class="flex justify-center items-center h-[88px] w-full">
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
		<div class="p-2 whitespace-pre-line max-h-96 overflow-y-auto text-sm">
			{translatedText}
		</div>

		<div class="p-2 flex flex-row items-center justify-between">
			<div class="flex flex-row">
				{#each tabs as item}
					{#if item.component && translate[item.srcKey]}
						<button
							type="button"
							class="
								hover:bg-gray-200
								rounded-md
								text-sm
								px-2
								py-1.5
								mr-2
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
									w-6
									h-6
									{activeTab === item.tab ? 'rotate-180' : ''}
									transition-transform
								"
							>
								<path
									stroke="#6b7280"
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6 8l4 4 4-4"
								/>
							</svg>
						</button>
					{/if}
				{/each}
			</div>
			<div class="flex flex-row">
				<ButtonCopy {translatedText} />
			</div>
		</div>

		<dir class="m-0 p-0">
			{#each tabs as item}
				{#if activeTab === item.tab}
					<div transition:slide|local={{ duration: 250 }}>
						<svelte:component this={item.component} {translate} />
					</div>
				{/if}
			{/each}
		</dir>
	{:catch error}
		<div class="p-2 whitespace-pre-line max-h-96 overflow-y-auto text-sm text-red-500">
			Something went wrong: {error.message}
		</div>
		{@const l = console.log(error)}
	{/await}
</main>

<footer class="p-2 flex flex-row items-center border-t border-gray-300 dark:border-gray-700">
	<a
		href={`https://translate.google.com/?sl=${sourceLang}&tl=${targetLang}&text=${encodeURIComponent(
			selection
		)}`}
		target="_blank"
		rel="noreferrer"
		class="text-blue-600 visited:text-purple-600 underline"
	>
		<div class="flex flex-row items-center">
			<span>Google Translate</span>
			<span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="ml-1 w-5 h-5"
				>
					<path
						fill-rule="evenodd"
						d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
						clip-rule="evenodd"
					/>
					<path
						fill-rule="evenodd"
						d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
						clip-rule="evenodd"
					/>
				</svg>
			</span>
		</div>
	</a>
</footer>

<script>
import { createEventDispatcher, afterUpdate } from 'svelte';
import { slide } from 'svelte/transition';
import { persistentStore } from '@/common/store';
import { runtime, i18n } from 'webextension-polyfill';
import { languages } from '@/common/settings';
import Select from '@/lib/Select.svelte';
import Dictionary from './lib/Dictionary.svelte';
import Definitions from './lib/Definitions.svelte';
import Examples from './lib/Examples.svelte';
import ButtonCopy from './lib/ButtonCopy.svelte';

const dispatch = createEventDispatcher();

let sourceLang = 'auto',
	targetLang,
	selection,
	translatedText;

const getTranslate = async () => {
	const selectedText = document.getSelection().toString().trim();

	if (selectedText) {
		selection = selectedText;
	}

	//console.log(selection.length); // max 2000

	targetLang = $persistentStore.targetLang;

	const translate = await runtime.sendMessage({
		getTranslate: {
			sourceLang,
			targetLang,
			selection,
		},
	});

	sourceLang = sourceLang === 'auto' ? translate.src.replace('-', '_') : sourceLang;
	translatedText = translate.sentences.reduce((a, v) => (a += v.trans), '');

	return translate;
};

let promise = getTranslate();

const handleTranslate = () => {
	promise = getTranslate();
};

const tabs = [
	{ tab: 0, srcKey: false, label: '', component: false },
	{ tab: 1, srcKey: 'dict', label: i18n.getMessage('tooltip_dictionary'), component: Dictionary },
	{
		tab: 2,
		srcKey: 'definitions',
		label: i18n.getMessage('tooltip_definitions'),
		component: Definitions,
	},
	{ tab: 3, srcKey: 'examples', label: i18n.getMessage('tooltip_examples'), component: Examples },
];

let activeTab = 0;

const tabHandler = tab => {
	activeTab = activeTab === tab ? 0 : tab;
};

afterUpdate(() => {
	dispatch('update');
});
</script>
