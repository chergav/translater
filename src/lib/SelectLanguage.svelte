<Listbox
	class="relative w-min h-min text-sm"
	change={onchange}
	onopen={() => {
		search = '';
	}}
	bind:value
	bind:open
>
	<ListboxButton
		class="
			relative
			pl-3
			pr-10
			w-52
			h-7
			flex
			items-center
			border
			border-variant-200-800
			text-start
			overflow-hidden
			whitespace-nowrap
			rounded-full
			hover:bg-accent-primary/10
			transition-colors
			cursor-pointer
			{open ? 'bg-accent-primary/10' : ''}
		"
	>
		<span class="block truncate">{getI18nLangName(value)}</span>
		<Icon
			class="
				pointer-events-none
				absolute
				right-1
				{open ? 'text-accent' : 'text-secondary'}
			"
			d={mdiUnfoldMoreHorizontal}
		/>
	</ListboxButton>
	<ListboxOptions
		class="
			absolute
			left-0
			max-h-64
			flex
			flex-col
			overflow-hidden
			select-none
			bg-surface
			border
			border-variant-200-800
			rounded-xl
			shadow-lg
			z-10
		"
	>
		<div class="relative flex items-center">
			<input
				bind:this={inputSearch}
				class="
					w-full
					px-2
					h-8
					bg-surface
					text-sm
					border-t-0
					border-x-0
					border-b
					border-variant-200-800
					focus:ring-0
					outline-0
				"
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
					iconSize="20"
					onclick={() => {
						search = '';
						tick().then(() => inputSearch?.focus());
					}}
					small
					title={browser.i18n.getMessage('tooltip_clear_search')}
				/>
			{/if}
		</div>
		<div
			class="
				flex
				p-1
				overflow-x-hidden
				overflow-y-auto
				scrollbar
			"
		>
			{#each langColumns as langColumn, index (index)}
				<div class="flex flex-col">
					{#each langColumn as lang, index (index)}
						<ListboxOption
							class="
								pl-2
								pr-2.5
								py-1
								flex
								items-center
								gap-2
								select-none
								not-aria-selected:hover:bg-accent-primary/5
								aria-selected:bg-accent-primary/10
								rounded-full
								cursor-pointer
								whitespace-nowrap
							"
							value={lang.code}
						>
							{#snippet children(selected)}
								{@const markYourLang = markUILang && UILanguage.startsWith(lang.code)}
								<span class="size-[18px] inline-flex">
									{#if selected}
										<Icon class="text-accent" d={mdiCheck} size="18" />
									{:else if markYourLang}
										<span title="Your language">
											<Icon class="text-secondary" d={mdiStarOutline} size="18" />
										</span>
									{/if}
								</span>
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<span class={selected ? 'text-accent font-medium' : ''}>{@html lang.language}</span>
							{/snippet}
						</ListboxOption>
					{/each}
				</div>
			{:else}
				<p class="w-full p-1 text-secondary">{browser.i18n.getMessage('select_language_search_no_results')}</p>
			{/each}
		</div>
	</ListboxOptions>
</Listbox>

<script lang="ts">
import type { Action } from 'svelte/action';
import type { Language } from '~/shared/types';
import { tick } from 'svelte';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '~/lib/headless';
import Button from '~/lib/Button.svelte';
import { languages } from '~/shared/languages';
import Icon from '~/lib/Icon.svelte';
import { mdiClose, mdiCheck, mdiStarOutline, mdiUnfoldMoreHorizontal } from '@mdi/js';

interface Props {
	value: string
	auto?: boolean
	markUILang?: boolean
	onchange?: () => void
}

let {
	value = $bindable(),
	auto = false,
	markUILang = false,
	onchange,
}: Props = $props();

let inputSearch = $state<HTMLInputElement>();
let search = $state<string>('');
let open = $state<boolean>();
const UILanguage = browser.i18n.getUILanguage();

const inputFocus: Action<HTMLInputElement> = input => {
	tick().then(() => input.focus());
};

const getI18nLangName = (langCode: string) =>
	// @ts-expect-error ignore messageName
	browser.i18n.getMessage(`language_${langCode.replace('-', '_')}`).toLowerCase() || 'language not defined';

const sortedI18nLanguages = languages
	.map(({ code }) => ({
		code,
		language: getI18nLangName(code),
	}))
	.sort((a, b) => a.language.localeCompare(b.language));

if (auto) {
	sortedI18nLanguages.unshift({
		code: 'auto',
		language: browser.i18n.getMessage('language_auto'),
	});
}

let filteredLangs = $derived<Language[]>(sortedI18nLanguages
	.filter(i => {
		const re = new RegExp(`${search}`, 'gi');
		return re.test(i.code) || re.test(i.language);
	})
	.map(({ code, language }) => {
		if (search !== '') {
			const re = new RegExp(`(${search})`, 'gi');
			return {
				code,
				language: language.replace(re, '<span class="font-bold text-accent">$&</span>'),
			};
		}
		return {
			code,
			language,
		};
	}),
);

let columns = $derived<number>(search === '' ? 3 : 1);
let langColumns = $derived(listToColumns(filteredLangs, columns));

function arrayTo2dArray(
	array: Language[],
	columnElems: number,
): Language[][] {
	return array.reduce<Language[][]>((rows, val, index) => {
		if (index % columnElems === 0) {
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
</script>
