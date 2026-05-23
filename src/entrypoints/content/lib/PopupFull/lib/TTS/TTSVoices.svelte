<Listbox
	align="center"
	onchange={value => setVoice(value.name)}
	quick={storage.motionDisabled}
	{triggerRef}
	bind:value={voice}
>
	{#snippet listboxButton({ toggle, open })}
		<IconButton
			active={open}
			color="standard"
			onclick={toggle}
			size="xs"
			title={voice.name}
			bind:ref={triggerRef}
		>
			<VoiceSelection />
		</IconButton>
	{/snippet}

	{#each voices as voice (voice)}
		<ListboxOption
			label={voice.name}
			size="xs"
			value={voice}
		>
			{#snippet leadingIcon(selected)}
				{#if selected}
					<Check />
				{/if}
			{/snippet}
		</ListboxOption>
	{/each}
</Listbox>

<script lang="ts">
import { storage } from '~/shared/storage.svelte';
import { Listbox, ListboxOption } from '~/lib/base/Listbox';
import IconButton from '~/lib/base/IconButton.svelte';
import VoiceSelection from '~icons/material-symbols/voice-selection-rounded';
import Check from '~icons/material-symbols/check-rounded';

interface Props {
	targetLang: string
	voice: SpeechSynthesisVoice
	voices: SpeechSynthesisVoice[]
}

let {
	targetLang,
	voice,
	voices ,
}: Props = $props();

let triggerRef = $state<HTMLButtonElement | null>(null);

function setVoice(name: string) {
	storage.settings.ttsVoiceByLang[targetLang] = name;
}
</script>
