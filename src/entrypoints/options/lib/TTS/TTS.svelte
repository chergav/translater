<h1 class="text-xl text-color-on-surface-variant">Text-to-Speech</h1>

<h2 class="text-sm font-medium text-color-on-surface-variant">
	{browser.i18n.getMessage('options_tts_voices')}
</h2>

{#await store.voices}
	<p>loading ...</p>
{:then voices}
	{#if voices?.length}
		<table class="table-auto border-separate border-spacing-0 overflow-hidden rounded-3xl border border-color-outline-variant text-sm">
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
import type { Language } from '~/types';
import { store } from '~/entrypoints/options/store.svelte';
import TTSVoicesItem from './lib/TTSVoicesItem.svelte';
import { languagesLocalArray, getDisplayedLanguageName } from '~/shared/languages';
import { getVoices } from '~/entrypoints/content/lib/PopupFull/lib/TTS/utils/tts';

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
</script>
