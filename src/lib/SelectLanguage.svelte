<Listbox
	class="relative w-min h-min text-sm"
	bind:value
	on:listbox_open={() => {
		search = '';
	}}
	on:change
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
			border-gray-300
			dark:border-gray-800
			text-start
			overflow-hidden
			whitespace-nowrap
			rounded-full
			hover:border-gray-400
			hover:dark:border-gray-700
			transition-colors
		"
	>
		<span class="block truncate">{getI18nLangName(value)}</span>
		<Icon
			class="
				pointer-events-none
				absolute
				right-1
				text-gray-500
			"
			d={heroChevronUpDown}
		/>
	</ListboxButton>
	<ListboxOptions
		class="
			absolute
			left-0
			max-h-64
			overflow-x-hidden
			overflow-y-auto
			my-1
			flex
			flex-col
			select-none
			bg-white
			dark:bg-gray-900
			border
			border-gray-100
			dark:border-gray-800
			rounded-xl
			shadow-lg
			scrollbar
			z-10
		"
	>
		<div class="relative flex items-center">
			<input
				bind:this={inputSearch}
				class="
					w-full
					h-8
					bg-white
					dark:bg-gray-900
					text-sm
					border-t-0
					border-x-0
					border-b
					border-gray-100
					dark:border-gray-800
					focus:ring-0
					focus:border-gray-100
					focus:dark:border-gray-800
				"
				placeholder={getMessage('select_language_search_placeholder')}
				spellcheck="false"
				type="text"
				bind:value={search}
				use:inputFocus
			>
			{#if search}
				<ButtonImage
					class="
						absolute
						right-1
						w-6
						h-6
					"
					icon={heroXMark}
					round
					title="Clear search"
					on:click={() => {
						search = '';
						inputSearch.focus();
					}}
				/>
			{/if}
		</div>
		<div class="flex py-1">
			{#each langColumns as langColumn}
				<div class="flex flex-col w-full">
					{#each langColumn as lang}
						<ListboxOption
							class="
								relative
								pl-10
								py-1
								pr-3
								flex
								items-center
								whitespace-nowrap
								select-none
								hover:bg-gray-900/10
								dark:hover:bg-white/10
								rounded-sm
							"
							focus={false}
							value={lang.key}
							let:selected
						>
							{#if selected}
								<span class="absolute left-0 pl-3 text-blue-600">
									<Icon d={heroCheck} />
								</span>
							{:else if UILanguage.startsWith(lang.key) && markUILang}
								<span
									class="absolute left-0 pl-3 text-gray-500"
									title="Your UI language"
								>
									<Icon d={heroStar} />
								</span>
							{/if}
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							<span class={selected ? 'text-blue-600 font-medium' : ''}>{@html lang.name}</span>
						</ListboxOption>
					{/each}
				</div>
			{:else}
				<p class="w-full py-1 text-center">{getMessage('select_language_search_no_results')}</p>
			{/each}
		</div>
	</ListboxOptions>
</Listbox>

<script>
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '~/lib/headless';
import ButtonImage from '~/lib/ButtonImage.svelte';
import { languages } from '~/common/settings';
import { getMessage, getUILanguage } from '~/common/browserApi';
import Icon from '~/lib/Icon.svelte';
import { heroCheck, heroChevronUpDown, heroXMark, heroStar } from '~/icons/heroicons';

export let value;
export let auto = false;
export let markUILang = false;

let inputSearch;
let search = '';
let UILanguage = getUILanguage();

const inputFocus = elem => {
	elem.focus();
};

const getI18nLangName = langCode => getMessage(`supported_languages_${langCode.replace('-', '_')}`).toLowerCase() || 'language not defined';

const sortedI18nLanguages = Object.entries(languages)
	.map(([key]) => ({
		key,
		name: getI18nLangName(key)
	}))
	.sort((a, b) => a.name.localeCompare(b.name));

if (auto) {
	sortedI18nLanguages.unshift({
		key: 'auto',
		name: getMessage('select_language_auto')
	});
}

$: filteredLangs = sortedI18nLanguages
	.filter(i => {
		const re = new RegExp(`${search}`, 'gi');
		return re.test(i.key) || re.test(i.name);
	})
	.map(({ key, name }) => {
		if (search !== '') {
			const re = new RegExp(`(${search})`, 'gi');
			return {
				key,
				name: name.replace(re, '<span class="font-bold text-amber-500">$&</span>')
			};
		}
		return { key, name };
	});

const arrayTo2dArray = (array, columnElems) =>
	array.reduce((rows, val, index) => (index % columnElems === 0
		? rows.push([val])
		: rows[rows.length - 1].push(val)) && rows, []);

const listToColumns = (array, columns) => arrayTo2dArray(array, Math.ceil(array.length / columns));

$: columns = search === '' ? 3 : 1;
$: langColumns = listToColumns(filteredLangs, columns);
</script>
