<ButtonImage
	disabled={$status?.error}
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
{#if voices && voices.length}
	<Select
		round
		small
		bind:value={voice}
	>
		{#each voices as voice}
			<option value={voice}>{voice.name}</option>
		{/each}
	</Select>
{/if}

<script>
import { onMount, onDestroy } from 'svelte';
import { sourceLang } from '~/content/store';
import { targetLang } from '~/common/store';
import { getMessage } from '~/common/browserApi';
import ButtonImage from '~/lib/ButtonImage.svelte';
import Select from '~/lib/Select.svelte';
import Icon from '~/lib/Icon.svelte';
import { heroSpeakerWave, heroSpeakerXMark, heroStop } from '~/icons/heroicons';
import getTTS from '~/content/scripts/TTS/tts';

export let text;
export let lang;

let tts,
	voices,
	voice,
	status;

$: title = $status?.error
	? getMessage('tooltip_listen_language_is_not_support')
	: $status?.speaking
		? getMessage('tooltip_listen_stop')
		: getMessage('tooltip_listen_to_the_text');

const speak = () => {
	tts.speak(text, lang, voice);
};

const stop = () => {
	if (tts) tts.stop();
};

const startTTS = () => {
	if (!$status?.waiting) {
		$status?.speaking ? stop() : speak();
	}
};

const setTTS = async () => {
	tts = await getTTS(lang);
	status = tts.status;
	voices = await tts.getVoicesByLang(lang);
	voice = voices[0];
};

$: if ($sourceLang !== 'auto' || $targetLang) {
	setTTS();
}

onMount(async () => {
	setTTS();
});

onDestroy(stop);
</script>
