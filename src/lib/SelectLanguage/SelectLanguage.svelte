<Listbox
	{align}
	{onchange}
	quick={storage.motionDisabled}
	scrollToSelected={shouldScrollToSelected}
	{triggerRef}
	bind:value
>
	{#snippet listboxButton({ open, toggle, triggerKeydown })}
		<Button
			class={triggerClass}
			active={open}
			color="text"
			label={button.label}
			onclick={toggle}
			onkeydown={triggerKeydown}
			size="xs"
			title={button.title}
			bind:ref={triggerRef}
		/>
	{/snippet}
	{#snippet listboxSearch()}
		<ListboxSearch bind:value={search} />
	{/snippet}
	<ul class="flex flex-1 flex-col gap-0.5">
		{#if autoLang && !searchTrimmed}
			<ListboxOption
				label={sourceLanguageAuto.language}
				value={sourceLanguageAuto.code}
			>
				{#snippet leadingIcon(selected)}
					{#if selected}
						<CheckRounded />
					{/if}
				{/snippet}
				{#snippet trailingIcon()}
					<Awesome />
				{/snippet}
			</ListboxOption>
			<div class="mx-2 my-1 h-px shrink-0 bg-color-outline-variant"></div>
		{/if}

		{#if pinedLangs.length && !searchTrimmed}
			<li
				class="px-3 py-1 text-xs font-medium text-color-on-surface-variant"
				aria-hidden="true"
				role="presentation"
			>
				{browser.i18n.getMessage('select_language_pinned')}
			</li>
			<ul class="flex flex-1 flex-col gap-0.5">
				{#each pinedLangs as { code, language } (code)}
					<div
						animate:flip={{
							duration: durationFlip,
							easing: expressiveSpatialFast,
						}}
					>
						<ListboxOption
							label={language}
							value={code}
						>
							{#snippet leadingIcon(selected)}
								{#if selected}
									<CheckRounded />
								{/if}
							{/snippet}
							{#snippet trailingIcon()}
								<button
									class={[
										'flex size-6 rounded-full p-0.5 hover:bg-color-on-surface/8 active:bg-color-on-surface/16',
										'opacity-0 group-hover/lang:opacity-100 group-focus-visible/lang:opacity-100',
										'transition-opacity ease-effects-fast',
									]}
									onclick={e => unpinLanguage(e, code)}
									title={browser.i18n.getMessage('select_language_unpin_lang')}
									type="button"
								>
									<KeepOff />
								</button>
							{/snippet}
						</ListboxOption>
					</div>
				{/each}
			</ul>
			<div class="mx-2 my-1 h-px shrink-0 bg-color-outline-variant"></div>
		{/if}

		<li
			class="px-3 py-1 text-xs font-medium text-color-on-surface-variant"
			aria-hidden="true"
			role="presentation"
		>
			{browser.i18n.getMessage('select_language_all_langs')}
		</li>

		{#each filteredLangs as { code, language, pinned, pinTitle } (code)}
			<ListboxOption
				label={language}
				value={code}
			>
				{#snippet leadingIcon(selected)}
					{#if selected}
						<CheckRounded />
					{/if}
				{/snippet}
				{#snippet trailingIcon()}
					<button
						class={[
							'flex size-6 rounded-full p-0.5 hover:bg-color-on-surface/8 active:bg-color-on-surface/16',
							'opacity-0 group-hover/lang:opacity-100 group-focus-visible/lang:opacity-100',
							'transition-opacity ease-effects-fast',
						]}
						onclick={e => pinned ? unpinLanguage(e, code) : pinLanguage(e, code)}
						title={pinTitle}
						type="button"
					>
						{#if pinned}
							<KeepOff />
						{:else}
							<Keep />
						{/if}
					</button>
				{/snippet}
			</ListboxOption>
		{:else}
			<p class="px-3 py-2 text-sm text-color-on-surface-variant">
				{browser.i18n.getMessage('select_language_search_no_results')}
			</p>
		{/each}
	</ul>
</Listbox>

<script lang="ts">
import type { ComponentProps } from 'svelte';
import { PopupMode, PopupLayout } from '~/types';
import { flip } from 'svelte/animate';
import { storage } from '~/shared/storage.svelte';
import { expressiveSpatialFast } from '~/lib/base/utils/md3Easing';
import Listbox from './lib/Listbox.svelte';
import ListboxOption from './lib/ListboxOption.svelte';
import ListboxSearch from './lib/ListboxSearch.svelte';
import Button from '~/lib/base/Button.svelte';
import { languagesLocalArray, sourceLanguageAuto, getDisplayedLanguageName } from '~/shared/languages';
import CheckRounded from '~icons/material-symbols/check-rounded';
import KeepOff from '~icons/material-symbols/keep-off-outline-rounded';
import Keep from '~icons/material-symbols/keep-outline-rounded';
import Awesome from '~icons/material-symbols/auto-awesome-rounded';

type ListboxProps = ComponentProps<typeof Listbox>;

interface Props {
	value: ListboxProps['value']
	align?: ListboxProps['align']
	autoLang?: boolean
	detectedLang?: string
	mode?: PopupMode
	layout?: PopupLayout
	onchange?: ListboxProps['onchange']
}

let {
	value = $bindable(''),
	align = 'start',
	autoLang = false,
	detectedLang,
	mode =  PopupMode.Full,
	layout = PopupLayout.Vert,
	onchange,
}: Props = $props();

interface Language {
	code: string
	language: string
	pinned?: boolean
	pinTitle?: string
}

let triggerRef = $state<HTMLButtonElement| null>(null);
let search = $state<string>('');
const searchTrimmed = $derived<string>(search.trim());
const durationFlip = $derived<number>(storage.motionDisabled ? 0 : 350);
const triggerClass = $derived<string>(mode === PopupMode.Full ? layout === PopupLayout.Horiz ? 'w-36' : 'w-52' : '');

const languages = $derived(
	languagesLocalArray.map(({ code }): Language => {
		const pinned = storage.settings.pinedLangs.includes(code);
		return {
			code,
			language: getDisplayedLanguageName(code, 'name+code'),
			pinned,
			pinTitle: browser.i18n.getMessage(
				pinned ? 'select_language_unpin_lang' : 'select_language_pin_lang',
			),
		};
	}),
);

const pinedLangs = $derived(languages.filter(({ code }) => storage.settings.pinedLangs.includes(code)));
const shouldScrollToSelected = $derived<boolean>(!storage.settings.pinedLangs.includes(value));

const button = $derived.by(() => {
	const isAuto = value === 'auto' && detectedLang;
	const langCode = isAuto ? detectedLang : value;
	const suffix = isAuto ? ` (${browser.i18n.getMessage('language_auto')})` : '';
	const displayMode = mode === 'full' ? 'name' : 'code';

	return {
		title: getDisplayedLanguageName(langCode, 'name+code') + suffix,
		label: getDisplayedLanguageName(langCode, displayMode) + suffix,
	};
});

const filteredLangs = $derived.by<Language[]>(() => {
	if (searchTrimmed === '') return languages;

	const escapedSearch = RegExp.escape(searchTrimmed);
	const re = new RegExp(escapedSearch, 'gi');

	return languages
		.filter(i => i.language.toLowerCase().includes(searchTrimmed.toLowerCase()))
		.map(({ code, language, pinned, pinTitle }) => ({
			code,
			language: language.replace(re, '<mark>$&</mark>'),
			pinned,
			pinTitle,
		}));
});

function pinLanguage(e: Event, code: string) {
	e.stopPropagation();
	if (!storage.settings.pinedLangs.includes(code)) {
		storage.settings.pinedLangs.push(code);
	}
}

function unpinLanguage(e: Event, code: string) {
	e.stopPropagation();
	storage.settings.pinedLangs = storage.settings.pinedLangs.filter(v => v !== code);
}
</script>
