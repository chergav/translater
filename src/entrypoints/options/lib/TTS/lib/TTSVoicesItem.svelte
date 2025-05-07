<tr class="[&>td]:whitespace-nowrap">
	<td>
		<span>{// @ts-expect-error ignore messageName
			browser.i18n.getMessage(`language_${lang.replace('-', '_')}`).toLowerCase()}</span>
	</td>
	<td class="flex gap-2">
		<Select
			full
			onchange={() => {
				storage.settings.ttsVoiceByLang[lang] = selectedVoice.name;
			}}
			small
			bind:value={selectedVoice}
		>
			{#each voices as voice, index (index)}
				<option value={voice}>{voice.name} ({voice.lang})</option>
			{/each}
		</Select>
		<TTSButton
			{lang}
			showTTSVoices={false}
			text={selectedVoice.name}
			{voices}
		/>
	</td>
	<td>
		{voices.length}
	</td>
</tr>

<script lang="ts">
import { storage } from '~/shared/storage.svelte';
import Select from '~/lib/Select.svelte';
import TTSButton from '~/entrypoints/content/lib/Popup/lib/TTSButton.svelte';

interface Props {
	lang: string
	voices: SpeechSynthesisVoice[]
}

let {
	lang,
	voices,
}: Props = $props();

let selectedVoice = $derived(voices.find(i => i.name === storage.settings.ttsVoiceByLang[lang]) || voices[0]);
</script>
