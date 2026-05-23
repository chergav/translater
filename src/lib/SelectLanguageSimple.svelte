<Select
	class={className}
	{label}
	{labelIcon}
	{onchange}
	size="xs"
	bind:value
>
	{#each languages as { code, language } (code)}
		<option value={code}>{language}</option>
	{/each}
</Select>

<script lang="ts">
import type { Snippet } from 'svelte';
import type { ChangeEventHandler, ClassValue } from 'svelte/elements';
import type { Language } from '~/types';
import Select from '~/lib/base/Select.svelte';
import { languagesLocalArray, sourceLanguageAuto, getDisplayedLanguageName } from '~/shared/languages';

interface Props {
	value: string
	label?: string
	labelIcon?: Snippet
	autoLang?: boolean
	class?: ClassValue
	onchange?: ChangeEventHandler<HTMLSelectElement>
}

let {
	value = $bindable(),
	label,
	labelIcon,
	autoLang = false,
	class: className,
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
