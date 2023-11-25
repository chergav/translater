<tr class="[&>td]:whitespace-nowrap">
	<td>
		<span>{getMessage(`supported_languages_${lang.replace('-', '_')}`).toLowerCase()}</span>
	</td>
	<td class="flex gap-2">
		<Select
			class="w-full"
			small
			bind:value={voice}
			on:change={() => {
				$persistentStore.ttsVoiceByLang[lang] = voice.name;
			}}
		>
			{#each voices as voice}
				<option value={voice}>{voice.name} ({voice.lang})</option>
			{/each}
		</Select>
		<TTSPlay
			{lang}
			selectLang={false}
			text={voice.name}
			{voices}
		/>
	</td>
	<td>
		{voices.length}
	</td>
</tr>

<script>
import { persistentStore } from '~/common/store';
import { getMessage } from '~/common/browserApi';
import Select from '~/lib/Select.svelte';
import TTSPlay from '~/content/lib/TTSPlay.svelte';

export let lang;
export let voices;

let voice = voices.find(i => i.name === $persistentStore.ttsVoiceByLang[lang]) || voices[0];
</script>
