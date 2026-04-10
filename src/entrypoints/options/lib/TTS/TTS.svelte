<div class="scrollbar flex h-full flex-col gap-4 overflow-y-auto *:mx-auto *:w-full *:max-w-4xl">
	<h1 class="text-xl text-color-on-surface-variant">Text-to-Speech</h1>

	<h2 class="text-sm font-medium text-color-on-surface-variant">
		{browser.i18n.getMessage('options_tts_voices')}
	</h2>

	{#await store.voices}
		<p>loading ...</p>
	{:then voices}
		{#if voices?.length}
			<table class="table-auto border-separate border-spacing-0 overflow-hidden rounded-2xl border border-color-surface-high text-sm">
				<caption class="mt-2 caption-bottom px-2 text-start text-sm text-color-on-surface-variant">
					* {browser.i18n.getMessage('options_tts_table_caption')}
				</caption>
				<thead>
					<tr
						class={[
							'[&>th]:px-2 [&>th]:py-3 [&>th]:text-start [&>th]:font-medium [&>th]:text-color-on-surface-variant [&>th:nth-child(3)]:text-end',
							'[&>th]:border-color-surface-high [&>th]:not-last:border-r',
							'bg-color-surface-container-low',
						]}
					>
						<th>{browser.i18n.getMessage('options_tts_language')} *</th>
						<th>{browser.i18n.getMessage('options_tts_default_voice')}</th>
						<th>{browser.i18n.getMessage('options_tts_voices')}</th>
					</tr>
				</thead>
				<tbody
					class={[
						'[&>tr>td]:border-t [&>tr>td]:border-color-surface-high [&>tr>td]:not-last:border-r',
						'[&>tr>td]:px-2 [&>tr>td]:py-1 [&>tr>td:nth-child(3)]:text-end',
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
		{:else if !voices?.length}
			<p class="text-sm text-color-on-surface-variant">
				{browser.i18n.getMessage('options_tts_no_voices_found')}
			</p>
		{/if}
	{:catch}
		<p>Oops. something's wrong.</p>
	{/await}
</div>

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
