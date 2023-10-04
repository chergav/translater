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
		<div class="mb-1 bg-white dark:bg-gray-900 rounded-[16px] overflow-hidden">
			<div class="p-1">
				<div class="flex justify-between">
					<div class="flex gap-1">
						<SelectLang
							small
							round
							auto
							bind:value={$store.sourceLang}
							on:change={handleTranslate}
							{languages}
						/>
						<ButtonCopy text={translate.sentences.orig} />
						<ButtonTTS text={translate.sentences.orig} lang={$store.sourceLang} />
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
					class="p-2 whitespace-pre-line max-h-80 overflow-y-auto scrollbar"
					transition:slide|local={{ duration: 150, easing: cubicInOut }}
				>
					<div class="w-full flex items-start justify-between">
						<div
							bind:this={elemOrig}
							class={elemOrigLines > 3 ? 'text-sm' : 'text-base'}
						>
							{translate.sentences.orig}
						</div>
						<ButtonImage
							round
							class="-mr-1"
							tooltip={{
								title: `${
									isOrigContenteditable
										? getMessage('tooltip_translate_again')
										: getMessage('tooltip_edit_text')
								}`,
							}}
							icon={isOrigContenteditable ? heroCheck : heroPencilSquare}
							on:click={origTextEdit}
						/>
					</div>
					{#if translate.sentences.src_translit && $persistentStore.showTransliteration}
						<div class="mt-2 text-sm text-gray-500">
							{translate.sentences.src_translit}
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<div class="mb-1 bg-white dark:bg-gray-900 rounded-[16px] overflow-hidden">
			<div class="p-1">
				<div class="flex justify-between">
					<div class="flex gap-1">
						<SelectLang
							small
							round
							bind:value={$persistentStore.targetLang}
							on:change={handleTranslate}
							{languages}
						/>
						<ButtonCopy text={translate.sentences.trans} />
						<ButtonTTS
							text={translate.sentences.trans}
							lang={$persistentStore.targetLang}
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
					<div bind:this={elemTrans} class={elemTransLines > 3 ? 'text-sm' : 'text-base'}>
						{translate.sentences.trans}
					</div>
					{#if translate.sentences.translit && $persistentStore.showTransliteration}
						<div class="mt-2 text-sm text-gray-500">{translate.sentences.translit}</div>
					{/if}
				</div>
			{/if}
		</div>
	</main>

	<footer>
		<div class="flex items-center justify-between">
			<div class="flex gap-1">
				{#each tabs as item}
					{#if item.component && translate[item.srcKey]}
						<ButtonTab
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
									{activeTab === item.tab ? 'transform -scale-y-100' : ''}
								"
							/>
						</ButtonTab>
					{/if}
				{/each}
			</div>
			<div class="h-7 flex items-center">
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
						<Icon d={heroArrowTopRightOnSquare} class="ml-1" />
					</div>
				</a>
			</div>
		</div>

		<div>
			{#each tabs as item}
				{#if activeTab === item.tab}
					<div transition:slide|local={{ duration: 250, easing: cubicInOut }}>
						<svelte:component this={item.component} {translate} />
					</div>
				{/if}
			{/each}
		</div>
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
import { cubicInOut } from 'svelte/easing';
import { persistentStore } from '~/common/store';
import { store, selectedText } from '../store';
import { languages } from '~/common/settings';
import { getMessage } from '~/common/browserApi';
import SelectLang from '~/lib/SelectLang.svelte';
import ButtonTab from '~/lib/ButtonTab.svelte';
import ButtonImage from '~/lib/ButtonImage.svelte';
import Dictionary from './Dictionary.svelte';
import Definitions from './Definitions.svelte';
import Examples from './Examples.svelte';
import ButtonCopy from './ButtonCopy.svelte';
import ButtonTTS from './ButtonTTS.svelte';
import ButtonExpand from './ButtonExpand.svelte';
import { historyAdd } from '~/common/history';
import Icon from '~/lib/Icon.svelte';
import {
	heroChevronDown,
	heroArrowTopRightOnSquare,
	heroPencilSquare,
	heroCheck,
} from '~/icons/heroicons';

const dispatch = createEventDispatcher();

let originalOpen = $persistentStore.showOriginalText,
	translateOpen = true,
	activeTab = 0,
	elemOrig,
	elemTrans,
	elemTransLines,
	elemOrigLines,
	isOrigContenteditable = false;

const getElemLines = elem => elem.offsetHeight / parseInt(getComputedStyle(elem, null).lineHeight);

$: if (elemOrig) elemOrigLines = getElemLines(elemOrig);
$: if (elemTrans) elemTransLines = getElemLines(elemTrans);

const fetchTranslate = async (sourceLang, targetLang, selectedText) => {
	try {
		const content = {
			sourceLang,
			targetLang,
			selectedText,
		};

		const response = await chrome.runtime.sendMessage({
			type: 'getTranslate',
			content,
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

	const cached = $store.cacheTranslate.find(
		i =>
			i.sentences.orig === selectedText && i.targetLang === targetLang && i.src === sourceLang
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
			trans: sentences.trans,
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
		label: getMessage('popup_dictionary'),
		component: Dictionary,
	},
	{
		tab: 2,
		srcKey: 'definitions',
		label: getMessage('popup_definitions'),
		component: Definitions,
	},
	{
		tab: 3,
		srcKey: 'examples',
		label: getMessage('popup_examples'),
		component: Examples,
	},
];

const tabHandler = tab => {
	activeTab = activeTab === tab ? 0 : tab;
};

const origTextEdit = () => {
	if (isOrigContenteditable) {
		isOrigContenteditable = false;
		elemOrig.removeAttribute('contenteditable');
		elemOrig.innerText = elemOrig.innerText.trim();
		if ($store.selectedText !== elemOrig.innerText) {
			$store.selectedText = elemOrig.innerText;
		}
	} else {
		isOrigContenteditable = true;
		elemOrig.setAttribute('contenteditable', true);
		elemOrig.focus();
	}
};

onMount(() => {
	dispatch('update');
});
</script>
