{#await voicesPromise}
	<Loader />
{:then voices}
	<TTSButton {targetLang} {text} voices={getVoicesByLang(targetLang, voices)} />
{/await}

<script lang="ts">
import TTSButton from './TTSButton.svelte';
import { getVoices, getVoicesByLang } from './utils/tts';
import Loader from '~/lib/Loader.svelte';

interface Props {
	targetLang: string
	text: string
}

let {
	targetLang,
	text,
}: Props = $props();

const voicesPromise = getVoices();
</script>
