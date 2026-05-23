<IconButton
	color="standard"
	disabled={status?.error || !text}
	onclick={startSpeak}
	size="xs"
	{title}
>
	<Icon class={[status?.waiting && 'animate-spin']} />
</IconButton>
{#if voices.length && voice && showTTSVoices}
	<TTSVoices {targetLang} {voice} {voices} />
{/if}

<script lang="ts">
import { type Component, onDestroy } from 'svelte';
import { BrowserTTS } from './utils/BrowserTTS.svelte';
import { GoogleTTS } from './utils/GoogleTTS.svelte';
import { storage } from '~/shared/storage.svelte';
import IconButton from '~/lib/base/IconButton.svelte';
import TTSVoices from './TTSVoices.svelte';
import NoSound from '~icons/material-symbols/no-sound-outline-rounded';
import ProgressActivity from '~icons/material-symbols/progress-activity';
import Stop from '~icons/material-symbols/stop-rounded';
import VolumeUp from '~icons/material-symbols/volume-up-outline-rounded';
import { type Status, getTTS } from './utils/tts';

interface Props {
	targetLang: string
	text: string
	voices: SpeechSynthesisVoice[]
	showTTSVoices?: boolean
}

let {
	targetLang,
	text,
	voices,
	showTTSVoices = true,
}: Props = $props();

let tts = $derived<BrowserTTS | GoogleTTS>(getTTS(targetLang, voices));
let	status = $derived<Status>(tts.status);

let title = $derived(status?.error
	? browser.i18n.getMessage('tooltip_listen_language_is_not_support')
	: status?.speaking
		? browser.i18n.getMessage('tooltip_listen_stop')
		: browser.i18n.getMessage('tooltip_listen_to_the_text'),
);

let voice = $derived(storage.settings.ttsVoiceByLang && storage.settings.ttsVoiceByLang[targetLang]
	? voices.find(i => i.name === storage.settings.ttsVoiceByLang[targetLang])
	: voices[0],
);

let Icon = $derived<Component>(
	status?.error ? NoSound : status?.waiting ? ProgressActivity : status?.speaking ? Stop : VolumeUp,
);

function speak() {
	if (tts instanceof BrowserTTS) {
		tts?.speak({
			text,
			voice,
		});
	} else if (tts instanceof GoogleTTS) {
		tts?.speak({
			targetLang,
			text,
		});
	}
}

function stop() {
	tts?.stop();
}

function startSpeak() {
	if (!status) return;

	if (status.speaking) {
		stop();
	} else {
		speak();
	}
}

onDestroy(() => {
	stop();
});
</script>
