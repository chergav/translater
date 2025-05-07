<label class="text-gray-800 dark:text-gray-200">
	<span class="select-none {label ? 'mr-2' : ''}">{label}</span>
	<select
		name="select"
		class="
			{small ? 'p-1' : 'p-2'}
			max-w-[210px]
			{small ? 'text-sm' : 'text-base'}
			rounded-lg
			outline-0
			focus:ring-0
			dark:bg-gray-900
			border
			border-gray-300
			dark:border-gray-700
			dark:placeholder-gray-400
			dark:text-gray-200
			focus:border-gray-400
			focus:dark:border-gray-600
			transition-colors
			cursor-pointer
		"
		{onchange}
		bind:value
	>
		{#if auto}
			<option value="auto">
				{browser.i18n.getMessage('language_auto')}
			</option>
		{/if}
		{#each sortedI18nLanguages as { code, language } (code)}
			<option value={code}>{language}</option>
		{/each}
	</select>
</label>

<script lang="ts">
import type { ChangeEventHandler } from 'svelte/elements';
import { languages } from '~/shared/languages';

interface Props {
	value: string
	label: string
	auto?: boolean
	small?: boolean
	onchange?: ChangeEventHandler<HTMLSelectElement>
}

let {
	value = $bindable(),
	label,
	auto = false,
	small = false,
	onchange,
}: Props = $props();

const sortedI18nLanguages = languages
	.map(({ code }) => ({
		code,
		// @ts-expect-error ignore messageName
		language: browser.i18n.getMessage(`language_${code.replace('-', '_')}`).toLowerCase(),
	}))
	.sort((a, b) => a.language.localeCompare(b.language));
</script>
