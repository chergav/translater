{#await voicesPromise}
	<div
		class="
			animate-spin
			w-5
			h-5
			rounded-full
			border-[2px]
			border-gray-200
			border-r-blue-600
			dark:border-gray-600
			dark:border-r-blue-600
		"
	/>
{:then voices}
	<TTSPlay {lang} {text} voices={getVoicesByLang(lang, voices)} />
{/await}

<script>
import TTSPlay from '~/content/lib/TTSPlay.svelte';
import { getVoices, getVoicesByLang } from '~/content/scripts/TTS/tts';

export let text;
export let lang;

const voicesPromise = getVoices();
</script>
