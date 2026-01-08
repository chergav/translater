<div class="scrollbar h-full overflow-y-auto p-6">
	{#await store.voices}
		<p>loading ...</p>
	{:then voices}
		{#if voices?.length}
			<!-- <div class="flex justify-end">
				<Button
					label="restore all"
					onclick={() => {
						storage.settings.ttsVoiceByLang = {};
					}}
				/>
			</div> -->
			<table class="table-auto">
				<caption class="caption-bottom text-start text-sm text-color-on-surface-variant">
					* {browser.i18n.getMessage('options_tts_table_caption')}
				</caption>
				<thead>
					<tr class="[&>th]:p-1 [&>th]:text-start">
						<th>{browser.i18n.getMessage('options_tts_language')} *</th>
						<th>{browser.i18n.getMessage('options_tts_default_voice')}</th>
						<th>{browser.i18n.getMessage('options_tts_voices')}</th>
					</tr>
				</thead>
				<tbody
					class="
						[&>tr]:border-t
						[&>tr]:border-color-surface-high
						[&>tr>td]:p-1
						[&>tr>td:nth-child(3)]:text-center
					"
				>
					{#each sortedI18nLanguages as { code: lang } (lang)}
						{@const filteredVoices = voicesForLang(lang, voices)}
						{#if filteredVoices.length}
							<TTSVoicesItem {lang} voices={filteredVoices} />
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
import { store } from '~/entrypoints/options/store.svelte';
import TTSVoicesItem from './lib/TTSVoicesItem.svelte';
// import Button from '~/lib/Button.svelte';
import { languages } from '~/shared/languages';
import { getVoices } from '~/entrypoints/content/lib/Popup/lib/PopupMain/lib/TTS/utils/tts';

if (!store.voices) {
	store.voices = getVoices();
}

const sortedI18nLanguages = languages
	.map(({ code }) => ({
		code,
		// @ts-expect-error ignore messageName
		language: browser.i18n.getMessage(`language_${code.replace('-', '_')}`),
	}))
	.sort((a, b) => a.language.localeCompare(b.language));

const voicesForLang = (lang: string, voices: SpeechSynthesisVoice[]) => voices.filter(i => i.lang.startsWith(lang));
</script>
