<ButtonImage
	disabled={$status?.error || !text}
	round
	tooltip={{ title }}
	on:click={startTTS}
>
	{#if $status?.error}
		<Icon d={heroSpeakerXMark} />
	{:else if $status?.waiting}
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
	{:else if $status?.speaking}
		<Icon d={heroStop} />
	{:else}
		<Icon d={heroSpeakerWave} />
	{/if}
</ButtonImage>
{#if voices.length && selectLang}
	<TTSVoices {lang} {voice} {voices} />
{/if}

<script>
import { onDestroy } from 'svelte';
import { persistentStore } from '~/common/store';
import { getMessage } from '~/common/browserApi';
import ButtonImage from '~/lib/ButtonImage.svelte';
import TTSVoices from '~/content/lib/TTSVoices.svelte';
import Icon from '~/lib/Icon.svelte';
import { heroSpeakerWave, heroSpeakerXMark, heroStop } from '~/icons/heroicons';
import { getTTS } from '~/content/scripts/TTS/tts';

export let text;
export let lang;
export let voices;
export let selectLang = true;

let tts;
let	status;

$: title = $status?.error
	? getMessage('tooltip_listen_language_is_not_support')
	: $status?.speaking
		? getMessage('tooltip_listen_stop')
		: getMessage('tooltip_listen_to_the_text');

const speak = () => {
	tts.speak({ text, lang, voice });
};

const stop = () => {
	if (tts) tts.stop();
};

const startTTS = () => {
	if (!$status.waiting) {
		$status.speaking ? stop() : speak();
	}
};

$: voice = $persistentStore.ttsVoiceByLang && $persistentStore.ttsVoiceByLang[lang]
	? voices.find(i => i.name === $persistentStore.ttsVoiceByLang[lang])
	: voices[0];

$: if (lang) {
	tts = getTTS(lang, voices);
	status = tts.status;
}

onDestroy(stop);
</script>
