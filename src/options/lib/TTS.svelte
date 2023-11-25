<div class="p-6 h-full overflow-y-auto scrollbar">
	{#await $store.voices}
		<p>loading ...</p>
	{:then voices}
		{#if voices.length}
			<!-- <div class="flex justify-end">
				<ButtonImage
					label="restore all"
					on:click={() => {
						$persistentStore.ttsVoiceByLang = {};
					}}
				/>
			</div> -->
			<table class="table-auto">
				<caption class="caption-bottom text-sm text-start text-gray-500">
					* {getMessage('options_tts_table_caption')}
				</caption>
				<thead>
					<tr class="[&>th]:text-start [&>th]:p-1">
						<th>{getMessage('options_tts_language')} *</th>
						<th>{getMessage('options_tts_default_voice')}</th>
						<th>{getMessage('options_tts_voices')}</th>
					</tr>
				</thead>
				<tbody
					class="
						[&>tr]:border-t
						[&>tr]:border-t-gray-300
						[&>tr]:dark:border-t-gray-800
						[&>tr>td]:p-1
						[&>tr>td:nth-child(3)]:text-center
					"
				>
					{#each sortedI18nLanguages as { key: lang }}
						{@const voices = isVoicesForLang(lang, voices)}
						{#if voices.length}
							<TTSVoicesItem {lang} {voices} />
						{/if}
					{/each}
				</tbody>
			</table>
		{:else if voices.length === 0}
			<p class="text-sm text-gray-500">{getMessage('options_tts_no_voices_found')}</p>
		{/if}
	{:catch}
			<p>Oops. something's wrong.</p>
	{/await}
</div>

<script>
import { store } from '~/options/store';
import TTSVoicesItem from '~/options/lib/TTSVoicesItem.svelte';
// import ButtonImage from '~/lib/ButtonImage.svelte';
import { getMessage } from '~/common/browserApi';
import { languages } from '~/common/settings';
import { getVoices } from '~/content/scripts/TTS/tts';

if ($store.voices === null) {
	$store.voices = getVoices();
}

const sortedI18nLanguages = Object.keys(languages)
	.map(i => ({
		key: i,
		value: getMessage(`supported_languages_${i.replace('-', '_')}`)
	}))
	.sort((a, b) => a.value.localeCompare(b.value));

const isVoicesForLang = (lang, voices) => voices.filter(i => i.lang.startsWith(lang));
</script>
