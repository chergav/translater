<Listbox
	class="relative h-min w-min text-sm"
	change={onchange}
	onopen={() => {
		search = '';
	}}
	bind:value
	bind:open
>
	<ListboxButton
		class={[
			'relative flex h-8 w-52 cursor-pointer items-center overflow-hidden rounded-full pr-10 pl-3',
			'text-start whitespace-nowrap transition-colors',
			'border border-color-surface-high hover:bg-color-primary/10',
			open && 'bg-color-primary/10',
		]}
	>
		<span class="block truncate">{getI18nLangName(value)}</span>
		<Icon
			class={[
				'pointer-events-none absolute right-1',
				open ? 'text-color-primary' : 'text-color-on-surface-variant',
			]}
			d={mdiUnfoldMoreHorizontal}
		/>
	</ListboxButton>
	<ListboxOptions
		class={[
			'absolute left-0 z-10 flex max-h-64 flex-col overflow-hidden rounded-xl shadow-lg select-none',
			'border border-color-surface-high bg-color-surface',
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
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								<span class={selected ? 'font-medium text-color-primary' : ''}>{@html lang.language}</span>
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
</script>
