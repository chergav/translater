<Listbox
	{align}
	columns={search ? 1 : 2}
	{onchange}
	quick={storage.motionDisabled}
	bind:value
>
	{#snippet listboxButton()}
		<ListboxButton
			class={[ mode === 'full' && 'w-52']}
			lowAccent
			size="xs"
			title={button.title}
		>{button.label}</ListboxButton>
	{/snippet}
	{#snippet listboxSearch()}
		<ListboxSearch bind:value={search} />
	{/snippet}
	<div class="flex gap-0.5">
		{#each chunked as column, i (i)}
			<ul class="flex flex-1 flex-col gap-0.5">
				{#each column as { code, language } (code)}
					<ListboxOption
						label={language}
						value={code}
					>
						{#snippet leadingIcon(selected)}
							{#if selected}
								<CheckRounded />
							{/if}
						{/snippet}
					</ListboxOption>
				{:else}
					<p class="px-3 py-2 text-sm text-color-on-surface-variant">
						{browser.i18n.getMessage('select_language_search_no_results')}
					</p>
				{/each}
			</ul>
		{/each}
	</div>
</Listbox>

<script lang="ts">
import type { ComponentProps } from 'svelte';
import { storage } from '~/shared/storage.svelte';
import Listbox from './lib/Listbox.svelte';
import ListboxOption from './lib/ListboxOption.svelte';
import ListboxButton from './lib/ListboxButton.svelte';
import ListboxSearch from './lib/ListboxSearch.svelte';
import { languagesLocalArray, sourceLanguageAuto, getDisplayedLanguageName } from '~/shared/languages';
import CheckRounded from '~icons/material-symbols/check-rounded';

type ListboxProps = ComponentProps<typeof Listbox>;

type Mode = 'full' | 'simple';

interface Props {
	value: ListboxProps['value']
	align?: ListboxProps['align']
	autoLang?: boolean
	detectedLang?: string
	mode?: Mode
	onchange?: ListboxProps['onchange']
}

let {
	value = $bindable(''),
	align = 'start',
	autoLang = false,
	detectedLang,
	mode =  'full',
	onchange,
}: Props = $props();

interface Language {
	code: string
	language: string
}

let search = $state<string>('');
const searchTrimmed = $derived<string>(search.trim());

const languages = $derived<Language[]>([
	...(autoLang ? [sourceLanguageAuto] : []),
	...languagesLocalArray.map(({ code }) => ({
		code,
		language: getDisplayedLanguageName(code, 'name+code'),
	})),
]);

const button = $derived.by(() => {
	const isAuto = value === 'auto' && detectedLang;
	const langCode = isAuto ? detectedLang : value;
	const suffix = isAuto ? ` (${browser.i18n.getMessage('language_auto')})` : '';
	const displayMode = mode === 'full' ? 'name' : 'code';

	return {
		title: getDisplayedLanguageName(langCode, 'name+code') + suffix,
		label: getDisplayedLanguageName(langCode, displayMode) + suffix,
	};
});

const filteredLangs = $derived.by<Language[]>(() => {
	if (searchTrimmed === '') return languages;

	const escapedSearch = RegExp.escape(searchTrimmed);
	const re = new RegExp(escapedSearch, 'gi');

	return languages
		.filter(i => i.language.toLowerCase().includes(searchTrimmed.toLowerCase()))
		.map(({ code, language }) => ({
			code,
			language: language.replace(re, '<mark>$&</mark>'),
		}));
});

// console.log(filteredLangs[0]);

const chunked = $derived(searchTrimmed
	? [filteredLangs]
	: [
		filteredLangs.slice(0, Math.ceil(filteredLangs.length / 2)),
		filteredLangs.slice(Math.ceil(filteredLangs.length / 2)),
	],
);
</script>
