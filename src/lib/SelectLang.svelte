<label class="text-gray-800 dark:text-gray-200">
	<span class="select-none {label ? 'mr-2' : ''}">{label}</span>
	<select
		class="
			py-[3px]
			pl-3
			{small ? 'text-sm' : 'text-base'}
			{round ? 'rounded-full' : 'rounded-lg'}
			border-gray-300
			focus:border-indigo-300
			focus:ring
			focus:ring-indigo-200
			focus:ring-opacity-50
			dark:bg-gray-900
			dark:border-gray-800
			dark:placeholder-gray-400
			dark:text-gray-200
			dark:focus:ring-gray-500
			dark:focus:ring-opacity-50
			dark:focus:border-gray-500
			cursor-pointer
		"
		bind:value
		on:change
	>
		{#if auto}
			<option value="auto">
				{getMessage('select_language_auto')}
			</option>
		{/if}
		{#each sortI18nLanguages() as { key, value } (key)}
			<option value={key}>{value.toLowerCase()}</option>
		{/each}
	</select>
</label>

<script>
import { getMessage } from '~/common/browserApi';

export let value;
export let label = '';
export let languages = [];
export let auto = false;
export let small = false;
export let round = false;

const getI18nLanguages = () => languages.map(({ key }) => ({
	key,
	value: getMessage(`supported_languages_${key.replace('-', '_')}`)
}));

const sortI18nLanguages = () => getI18nLanguages().sort((a, b) => a.value.localeCompare(b.value));
</script>
