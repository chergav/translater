<tr class="[&>td]:whitespace-nowrap">
	<td>
		<span>{language.language}</span>
	</td>
	<td class="flex items-center gap-2">
		<Select
			full
			onchange={() => {
				storage.settings.ttsVoiceByLang[language.code] = selectedVoice.name;
			}}
			size="xs"
			bind:value={selectedVoice}
		>
			{#each voices as voice, index (index)}
				<option value={voice}>{voice.name} ({voice.lang})</option>
			{/each}
		</Select>
		<div>
			<TTSButton
				showTTSVoices={false}
				targetLang={language.code}
				text={selectedVoice.name}
				{voices}
			/>
		</div>
	</td>
	<td>
		{voices.length}
	</td>
</tr>

<script lang="ts">
import type { Language } from '~/types';
import { storage } from '~/shared/storage.svelte';
import Select from '~/lib/base/Select.svelte';
import TTSButton from '~/entrypoints/content/lib/PopupFull/lib/TTS/TTSButton.svelte';

interface Props {
	language: Language
	voices: SpeechSynthesisVoice[]
}

let {
	language,
	voices,
}: Props = $props();

let selectedVoice = $derived(voices.find(i => i.name === storage.settings.ttsVoiceByLang[language.code]) || voices[0]);
</script>
