<label class="text-gray-900 dark:text-white">
	<span>{label}</span>
	<select
		bind:value
		on:change
		class="
			{small ? 'py-[3px]' : 'p-1.5' }
			pl-1.5
			mr-2
			text-sm
			rounded-md
			border-gray-300
			focus:border-indigo-300
			focus:ring
			focus:ring-indigo-200
			focus:ring-opacity-50
			dark:bg-gray-800
			dark:border-gray-700
			dark:placeholder-gray-400
			dark:text-white
			dark:focus:ring-gray-500
			dark:focus:ring-opacity-50
			dark:focus:border-gray-500
			cursor-pointer
		"
	>
		{#if auto}
			<option value="auto">
				{i18n.getMessage('select_language_auto')}
			</option>
		{/if}
		{#each sortI18nLanguages() as { key, value } (key)}
			<option value={key}>{value}</option>
		{/each}
	</select>
</label>

<script>
import { i18n } from 'webextension-polyfill';
export let value;
export let label = '';
export let languages = [];
export let auto = false;
export let small = false;

const getI18nLanguages = () => {
	let i18nLanguages = [];
	
	for (const { key } of languages) {
		i18nLanguages.push({
			key,
			value: i18n.getMessage(`supported_languages_${key.replace('-', '_')}`)
		})
	}

	return i18nLanguages;
};

const sortI18nLanguages = () => getI18nLanguages().sort((a,b) => a.value.localeCompare(b.value));
</script>
