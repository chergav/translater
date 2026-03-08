<label class="ignore-active inline-flex items-center justify-between gap-2 select-none">
	{#if label}
		<span>{label}</span>
	{/if}
	<select
		name="select"
		class={[
			'cursor-pointer rounded-lg bg-color-surface text-color-on-surface transition-colors',
			'border border-color-surface-highest focus:border-color-outline-variant',
			'focus-visible:outline-custom focus-visible:outline-color-primary',
			small ? 'p-1.5 text-sm' : 'p-2.5 text-base',
		]}
		{onchange}
		bind:value
	>
		{#each languages as { code, language } (code)}
			<option value={code}>{language}</option>
		{/each}
	</select>
</label>

<script lang="ts">
import type { ChangeEventHandler } from 'svelte/elements';
import type { Language } from '~/types';
import { languagesLocalArray, sourceLanguageAuto, getDisplayedLanguageName } from '~/shared/languages';

interface Props {
	value: string
	label?: string
	autoLang?: boolean
	small?: boolean
	onchange?: ChangeEventHandler<HTMLSelectElement>
}

let {
	value = $bindable(),
	label,
	autoLang = false,
	small = false,
	onchange,
}: Props = $props();

const languages = $derived<Language[]>([
	...(autoLang ? [sourceLanguageAuto] : []),
	...languagesLocalArray.map(({ code }) => ({
		code,
		language: getDisplayedLanguageName(code, 'name+code'),
	})),
]);
</script>
