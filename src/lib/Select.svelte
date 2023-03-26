<label class="text-gray-900 dark:text-white">
	<span class="{label ? 'mr-2' : ''}">{label}</span>
	<select
		bind:value
		on:change
		class="
			{small ? 'py-[3px]' : 'py-1.5' }
			pl-1.5
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
			select-none
		"
	>
		{#if auto}
			<option value="auto">
				{getMessage('select_language_auto')}
			</option>
		{/if}
		{#each sortI18nLanguages() as { key, value } (key)}
			<option value={key}>{value}</option>
		{/each}
	</select>
</label>

<script>
import { getMessage } from '@/common/browserApi';
export let value;
export let label = '';
export let languages = [];
export let auto = false;
export let small = false;

const getI18nLanguages = () => languages.map(({ key }) => ({
	key,
	value: getMessage(`supported_languages_${key.replace('-', '_')}`)
}));

const sortI18nLanguages = () => getI18nLanguages().sort((a, b) => a.value.localeCompare(b.value));
</script>
