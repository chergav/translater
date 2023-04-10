<ButtonImage
	disabled={!availableVoice}
	on:click={() => {
		speaking ? speakCancel() : speak();
	}}
	tooltip={{ title }}
>
	{#if availableVoice}
		{#if speaking}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-5 h-5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
				/>
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-5 h-5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
				/>
			</svg>
		{/if}
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-5 h-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
			/>
		</svg>
	{/if}
</ButtonImage>

<script>
import { onDestroy } from 'svelte';
import { store } from '../store';
import { getMessage } from '~/common/browserApi';
import ButtonImage from '~/lib/ButtonImage.svelte';

export let textToSpeech;
export let langCode;

const synth = window.speechSynthesis;

let availableVoice,
	speaking = false,
	disabled = false;

synth.onvoiceschanged = () => {
	$store.voices = synth.getVoices();
};

const getavailableVoice = lang => {
	if (!lang || !$store.voices) {
		return;
	}

	return $store.voices.find(v => v.lang.startsWith(lang));
};

$: $store.voices, (availableVoice = getavailableVoice(langCode));

$: title = availableVoice
	? getMessage('tooltip_listen_to_the_text')
	: getMessage('tooltip_listen_language_is_not_support');

const speakCancel = () => {
	synth.cancel();
	speaking = false;
};

const speak = () => {
	disabled = true;
	if (synth.speaking) {
		speakCancel();
	}

	const ssu = new SpeechSynthesisUtterance(textToSpeech);

	ssu.lang = availableVoice.lang;

	ssu.onstart = () => {
		disabled = false;
		speaking = true;
	};

	ssu.onend = () => {
		speaking = false;
	};

	ssu.onerror = ({ error }) => {
		if (!['canceled', 'interrupted'].includes(error)) {
			console.error(`An error has occurred with the speech synthesis: ${error}`);
		}

		speaking = false;
	};

	synth.speak(ssu);
};

onDestroy(() => {
	speakCancel();
});
</script>
