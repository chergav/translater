<label class="inline-flex items-center gap-2 select-none">
	{#if label}
		<span>{label}</span>
	{/if}
	<select
		name="select"
		class={[
			'max-w-[210px] cursor-pointer rounded-lg bg-color-surface text-color-on-surface transition-colors',
			'border border-color-outline-variant focus:border-color-outline',
			'focus-visible:outline-custom focus-visible:outline-color-primary',
			small ? 'p-1.5 text-sm' : 'p-2.5 text-base',
		]}
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
	label?: string
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
