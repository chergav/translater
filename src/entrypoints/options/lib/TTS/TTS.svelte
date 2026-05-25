<h1 class="text-xl text-color-on-surface-variant">Text-to-Speech</h1>

<h2 class="text-sm font-medium text-color-on-surface-variant">
	TTS provider
</h2>
<div class="flex justify-center rounded-2xl bg-color-surface-bright p-4">
	<div class="flex items-center gap-0.5">
		{#each ttsProviders as { value, label, Icon, SelectedIcon } (value)}
			<ConnectedButtonRadio
				name="motion"
				{label}
				{value}
				bind:group={storage.settings.ttsProvider}
			>
				{#snippet icon()}
					<Icon />
				{/snippet}
				{#snippet selectedIcon()}
					<SelectedIcon />
				{/snippet}
			</ConnectedButtonRadio>
		{/each}
	</div>
</div>

<h2 class="text-sm font-medium text-color-on-surface-variant">
	{browser.i18n.getMessage('options_tts_voices')}
</h2>

{#await store.voices}
	<Loader class="size-6" />
{:then voices}
	{#if voices?.length}
		<table
			class={[
				'table-auto border-separate border-spacing-0 overflow-hidden rounded-3xl border border-color-outline-variant text-sm',
				externalTTSProviderOnly && 'pointer-events-none opacity-disabled select-none',
			]}
		>
			<thead>
				<tr
					class={[
						'[&>th]:px-4 [&>th]:py-3 [&>th]:text-start [&>th]:font-medium [&>th]:text-color-on-surface-variant [&>th:nth-child(3)]:text-end',
						'[&>th]:border-color-outline-variant [&>th]:not-last:border-r',
						'bg-color-surface-container-high',
					]}
				>
					<th>{browser.i18n.getMessage('options_tts_language')} *</th>
					<th>{browser.i18n.getMessage('options_tts_default_voice')}</th>
					<th>{browser.i18n.getMessage('options_tts_voices')}</th>
				</tr>
			</thead>
			<tbody
				class={[
					'[&>tr>td]:border-t [&>tr>td]:border-color-outline-variant [&>tr>td]:not-last:border-r',
					'bg-color-surface-bright [&>tr>td]:px-4 [&>tr>td]:py-1 [&>tr>td:nth-child(1)]:first-letter:uppercase [&>tr>td:nth-child(3)]:text-end',
				]}
			>
				{#each languages as language (language.code)}
					{@const filteredVoices = voicesForLang(language.code, voices)}
					{#if filteredVoices.length}
						<TTSVoicesItem {language} voices={filteredVoices} />
					{/if}
				{/each}
			</tbody>
		</table>
		<p class="caption-bottom text-start text-sm text-color-on-surface-variant">
			* {browser.i18n.getMessage('options_tts_table_caption')}
		</p>
	{:else if !voices?.length}
		<p class="text-sm text-color-on-surface-variant">
			{browser.i18n.getMessage('options_tts_no_voices_found')}
		</p>
	{/if}
{:catch}
	<p>Oops. something's wrong.</p>
{/await}

<script lang="ts">
import type { Component } from 'svelte';
import { type Language, TTSProvider } from '~/types';
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/options/store.svelte';
import ConnectedButtonRadio from '~/lib/base/ConnectedButtonRadio.svelte';
import Loader from '~/lib/Loader.svelte';
import TTSVoicesItem from './lib/TTSVoicesItem.svelte';
import { languagesLocalArray, getDisplayedLanguageName } from '~/shared/languages';
import { getVoices } from '~/entrypoints/content/lib/PopupFull/lib/TTS/utils/tts';
import SmartToyOutline from '~icons/material-symbols/smart-toy-outline-rounded';
import SmartToy from '~icons/material-symbols/smart-toy-rounded';
import CloudDoneOutline from '~icons/material-symbols/cloud-done-outline-rounded';
import CloudDone from '~icons/material-symbols/cloud-done-rounded';

if (!store.voices) {
	store.voices = getVoices();
}

const languages = $derived<Language[]>([
	...languagesLocalArray.map(({ code }) => ({
		code,
		language: getDisplayedLanguageName(code, 'name+code'),
	})),
]);

const voicesForLang = (lang: string, voices: SpeechSynthesisVoice[]) => voices.filter(i => i.lang.startsWith(lang));
const externalTTSProviderOnly = $derived<boolean>(storage.settings.ttsProvider === TTSProvider.Google);

const ttsProviders: {
	value: TTSProvider
	label: string
	Icon: Component
	SelectedIcon: Component
}[] = [
	{
		value: TTSProvider.Auto,
		label: 'Automatically',
		Icon: SmartToyOutline,
		SelectedIcon: SmartToy,
	},
	{
		value: TTSProvider.Google,
		label: 'External only',
		Icon: CloudDoneOutline,
		SelectedIcon: CloudDone,
	},
];
</script>
