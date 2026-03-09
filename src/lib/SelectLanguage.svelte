<Listbox
	class="relative text-sm"
	change={onchange}
	onopen={() => {
		search = '';
	}}
	bind:value
	bind:open
>
	<ListboxButton
		class={[
			'relative flex h-8 cursor-pointer items-center overflow-hidden rounded-full pr-8 pl-3',
			'text-start whitespace-nowrap transition-colors active:bg-color-primary/20',
			open ? 'bg-color-primary/10' : 'bg-color-surface-container hover:bg-color-primary/10',
			mode === 'full' && 'w-52',
		]}
		title={button.title}
	>
		<span class="block truncate">{button.label}</span>
		<Icon
			class={[
				'pointer-events-none absolute right-1 text-color-on-surface-variant transition-transform',
				open && '-scale-y-100',
			]}
			d={mdiChevronDown}
			size="20"
		/>
	</ListboxButton>
	<ListboxOptions
		class={[
			'absolute z-10 flex max-h-80 flex-col overflow-hidden rounded-xl shadow-lg select-none',
			'border border-color-surface-high bg-color-surface',
			alignClass,
		]}
	>
		<div class="relative flex items-center">
			<input
				bind:this={inputSearch}
				class={[
					'h-10 w-full border-x-0 border-t-0 border-b px-2 text-sm outline-none',
					'border-color-surface-high bg-color-surface',
				]}
				placeholder={browser.i18n.getMessage('select_language_search_placeholder')}
				spellcheck="false"
				type="text"
				bind:value={search}
				use:inputFocus
			>
			{#if search}
				<Button
					class="absolute right-1"
					icon={mdiClose}
					onclick={() => {
						search = '';
						tick().then(() => inputSearch?.focus());
					}}
					size="xs"
					title={browser.i18n.getMessage('tooltip_clear_search')}
				/>
			{/if}
		</div>
		<div class="scrollbar flex overflow-x-hidden overflow-y-auto p-1">
			{#each langColumns as langColumn, index (index)}
				<div class="flex flex-col">
					{#each langColumn as lang, index (index)}
						<ListboxOption
							class={[
								'flex cursor-pointer items-center gap-2 rounded-full py-1.5 pr-2.5 pl-2 whitespace-nowrap select-none',
								'not-aria-selected:hover:bg-color-primary/5 aria-selected:bg-color-primary/10',
							]}
							value={lang.code}
						>
							{#snippet children(selected)}
								{@const markYourLang = markUILang && UILanguage.startsWith(lang.code)}
								<span class="inline-flex size-5">
									{#if selected}
										<Icon class="text-color-primary" d={mdiCheck} size="20" />
									{:else if markYourLang}
										<span title="Your language">
											<Icon class="text-color-on-surface-variant" d={mdiStarOutline} size="20" />
										</span>
									{/if}
								</span>
								<span class={selected ? 'font-medium text-color-primary' : ''}>
									<!-- @html to show <mark></mark> -->
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html lang.language}
								</span>
							{/snippet}
						</ListboxOption>
					{/each}
				</div>
			{:else}
				<p class="w-full p-1 text-color-on-surface-variant">{browser.i18n.getMessage('select_language_search_no_results')}</p>
			{/each}
		</div>
	</ListboxOptions>
</Listbox>

<script lang="ts">
import type { Action } from 'svelte/action';
import type { Language } from '~/types';
import { tick } from 'svelte';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '~/lib/headless';
import Button from '~/lib/Button.svelte';
import Icon from '~/lib/Icon.svelte';
import { languagesLocalArray, sourceLanguageAuto, getDisplayedLanguageName } from '~/shared/languages';
import { mdiClose, mdiCheck, mdiStarOutline, mdiChevronDown } from '@mdi/js';

type Mode = 'full' | 'simple';

interface Props {
	value: string
	alignment?: 'left' | 'center' | 'right'
	autoLang?: boolean
	markUILang?: boolean
	detectedLang?: string
	mode?: Mode
	onchange?: () => void
}

let {
	value = $bindable(),
	alignment = 'left',
	autoLang = false,
	markUILang = false,
	detectedLang,
	mode =  'full',
	onchange,
}: Props = $props();

const UILanguage = browser.i18n.getUILanguage();
let inputSearch = $state<HTMLInputElement>();
let search = $state<string>('');
let open = $state<boolean>();
const alignClass = $derived<string>(
	alignment === 'left' ?
		'left-0' :
		alignment === 'right' ?
			'right-0' :
			'left-1/2 -translate-x-1/2',
);
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

let filteredLangs = $derived<Language[]>(languages
	.filter(i => {
		const re = new RegExp(`${search}`, 'gi');
		return re.test(i.code) || re.test(i.language);
	})
	.map(({ code, language }) => {
		if (search !== '') {
			const re = new RegExp(`(${search})`, 'gi');
			return {
				code,
				language: language.replace(re, '<mark>$&</mark>'),
			};
		}
		return {
			code,
			language,
		};
	}),
);

let columns = $derived<number>(search === '' ? 2 : 1);
let langColumns = $derived(listToColumns(filteredLangs, columns));

function arrayTo2dArray(
	array: Language[],
	columnElements: number,
): Language[][] {
	return array.reduce<Language[][]>((rows, val, index) => {
		if (index % columnElements === 0) {
			rows.push([val]);
		} else {
			rows[rows.length - 1].push(val);
		}
		return rows;
	}, []);
}

function listToColumns(array: Language[], columns: number) {
	return arrayTo2dArray(array, Math.ceil(array.length / columns));
}

const inputFocus: Action<HTMLInputElement> = input => {
	tick().then(() => input.focus());
};
</script>
