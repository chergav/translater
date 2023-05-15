<ButtonImage disabled={error} on:click={startTTS} tooltip={{ title }}>
	{#if error}
		<Icon d={heroSpeakerXMark} />
	{:else if waiting}
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
	{:else if speaking}
		<Icon d={heroStop} />
	{:else}
		<Icon d={heroSpeakerWave} />
	{/if}
</ButtonImage>

<script>
import { onMount, onDestroy } from 'svelte';
import { getMessage } from '~/common/browserApi';
import ButtonImage from '~/lib/ButtonImage.svelte';
import Icon from '~/lib/Icon.svelte';
import { heroSpeakerWave, heroSpeakerXMark, heroStop } from '@icons/heroicons';
import getTTS from '~/content/scripts/TTS/tts';

export let text;
export let lang;

let tts,
	waiting = false,
	speaking = false,
	error = false;

$: title = error
	? getMessage('tooltip_listen_language_is_not_support')
	: speaking
	? getMessage('tooltip_listen_stop')
	: getMessage('tooltip_listen_to_the_text');

onMount(async () => {
	tts = await getTTS(lang);
	tts.status.subscribe(v => {
		waiting = v.waiting;
		speaking = v.speaking;
		error = v.error;
	});
});

const speak = () => {
	tts.speak(text, lang);
};

const stop = () => {
	if (tts) tts.stop();	
};

const startTTS = () => {
	if (!waiting) {
		speaking ? stop() : speak();
	}
};

onDestroy(stop);
</script>
