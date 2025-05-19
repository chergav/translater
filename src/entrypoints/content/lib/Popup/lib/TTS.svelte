{#await voicesPromise}
	<Loader />
{:then voices}
	<TTSButton {lang} {text} voices={getVoicesByLang(lang, voices)} />
{/await}

<script lang="ts">
import TTSButton from './TTSButton.svelte';
import { getVoices, getVoicesByLang } from '../utils/tts';
import Loader from '~/lib/Loader.svelte';

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
