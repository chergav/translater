<Button
	disabled={status?.error || !text}
	{icon}
	iconClass={status?.waiting ? 'animate-spin' : ''}
	onclick={startSpeak}
	size="xs"
	{title}
/>
{#if voices.length && voice && showTTSVoices}
	<TTSVoices {lang} {voice} {voices} />
{/if}

<script lang="ts">
import { BrowserTTS } from '../utils/BrowserTTS.svelte';
import { GoogleTTS } from '../utils/GoogleTTS.svelte';
import { storage } from '~/shared/storage.svelte';
import Button from '~/lib/Button.svelte';
import TTSVoices from './TTSVoices.svelte';
// import Icon from '~/lib/Icon.svelte';
import { mdiVolumeHigh, mdiVolumeMute, mdiStop, mdiLoading } from '@mdi/js';
import { type Status, getTTS } from '../utils/tts';

interface Props {
	text: string
	lang: string
	voices: SpeechSynthesisVoice[]
	showTTSVoices?: boolean
}

let {
	text,
	lang,
	voices,
	showTTSVoices = true,
}: Props = $props();

let tts = $derived<BrowserTTS | GoogleTTS>(getTTS(lang, voices));
let	status = $derived<Status>(tts.status);

let title = $derived(status?.error
	? browser.i18n.getMessage('tooltip_listen_language_is_not_support')
	: status?.speaking
		? browser.i18n.getMessage('tooltip_listen_stop')
		: browser.i18n.getMessage('tooltip_listen_to_the_text'),
);

let voice = $derived(storage.settings.ttsVoiceByLang && storage.settings.ttsVoiceByLang[lang]
	? voices.find(i => i.name === storage.settings.ttsVoiceByLang[lang])
	: voices[0],
);

let icon = $derived(
	status?.error ? mdiVolumeMute : status?.waiting ? mdiLoading : status?.speaking ? mdiStop : mdiVolumeHigh,
);

function speak() {
	if (tts instanceof BrowserTTS) {
		tts?.speak({
			text,
			voice,
		});
	} else if (tts instanceof GoogleTTS) {
		tts?.speak({
			text,
			lang,
		});
	}
}

function stop() {
	if (tts) tts.stop();
}

function startSpeak() {
	if (!status) return;

	if (status.speaking) {
		stop();
	} else {
		speak();
	}
}

$effect(() => {
	return () => {
		stop();
	};
});
</script>
