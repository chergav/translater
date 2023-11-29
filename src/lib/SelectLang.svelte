<label class="text-gray-800 dark:text-gray-200">
	<span class="select-none {label ? 'mr-2' : ''}">{label}</span>
	<select
		class="
			py-[3px]
			pl-3
			max-w-[210px]
			{small ? 'text-sm' : 'text-base'}
			{round ? 'rounded-full' : 'rounded-lg'}
			focus:ring-0
			dark:bg-gray-900
			border-gray-300
			dark:border-gray-800
			dark:placeholder-gray-400
			dark:text-gray-200
			focus:border-gray-400
			focus:dark:border-gray-700
			transition-colors
			cursor-pointer
		"
		bind:value
		on:change
	>
		{#if auto}
			<option value="auto">
				{getMessage('supported_languages_auto')}
			</option>
		{/if}
		{#each sortedI18nLanguages as { key, lang } (key)}
			<option value={key}>{lang}</option>
		{/each}
	</select>
</label>

<script>
import { getMessage } from '~/common/browserApi';

export let value;
export let label = '';
export let languages = {};
export let auto = false;
export let small = false;
export let round = false;

const sortedI18nLanguages = Object.keys(languages)
	.map(i => ({
		key: i,
		lang: getMessage(`supported_languages_${i.replace('-', '_')}`).toLowerCase()
	}))
	.sort((a, b) => a.lang.localeCompare(b.lang));
</script>
