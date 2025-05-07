{#await voicesPromise}
	<div
		class="
			animate-spin
			w-7
			h-7
			rounded-full
			border-2
			border-gray-200
			dark:border-gray-600
			border-r-purple-800
			dark:border-r-purple-200
		"
	></div>
{:then voices}
	<TTSButton {lang} {text} voices={getVoicesByLang(lang, voices)} />
{/await}

<script lang="ts">
import TTSButton from './TTSButton.svelte';
import { getVoices, getVoicesByLang } from '../utils/tts';

interface Props {
	text: string
	lang: string
}

let {
	text,
	lang,
}: Props = $props();

const voicesPromise = getVoices();
</script>
