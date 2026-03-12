<label class="ignore-active inline-flex items-center justify-between gap-2 select-none">
	<div class="flex items-center gap-4">
		{#if icon}
			<div>
				<Icon d={icon} />
			</div>
		{/if}
		{#if label}
			<span>{label}</span>
		{/if}
	</div>
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
import Icon from './Icon.svelte';

interface Props {
	value: string
	label?: string
	autoLang?: boolean
	small?: boolean
	icon?: string
	onchange?: ChangeEventHandler<HTMLSelectElement>
}

let {
	value = $bindable(),
	label,
	autoLang = false,
	small = false,
	icon,
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
