<Listbox
	class="relative leading-0"
	change={() => {
		storage.settings.ttsVoiceByLang[lang] = voice.name;
	}}
	bind:value={voice}
	bind:open
>
	<ListboxButton as="div">
		<Button
			class="p-1"
			active={open}
			onclick={() => {}}
			size="xs"
			title={voice.name}
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html iconVoiceSelection}
		</Button>
	</ListboxButton>
	<ListboxOptions
		class={[
			'absolute left-0 z-10 scrollbar max-h-72 list-none overflow-y-auto rounded-xl py-1 text-sm shadow-lg select-none',
			'border border-color-surface-high bg-color-surface',
		]}
	>
		{#each voices as voice (voice)}
			<ListboxOption
				class={[
					'flex cursor-pointer items-center gap-2 py-1.5 pr-2.5 pl-2 whitespace-nowrap',
					'focus-within:outline-0 not-aria-selected:hover:bg-color-primary/5 focus:bg-color-primary/5 aria-selected:bg-color-primary/10',
				]}
				value={voice}
			>
				{#snippet children(selected)}
					<span class="inline-flex size-5 shrink-0">
						<Icon class="{selected ? 'inline-flex' : 'hidden'} text-color-primary shrink-0" d={mdiCheck} size="20" />
					</span>
					<span class={[selected && 'font-medium text-color-primary']}>{voice.name}</span>
				{/snippet}
			</ListboxOption>
		{/each}
	</ListboxOptions>
</Listbox>

<script lang="ts">
import { storage } from '~/shared/storage.svelte';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '~/lib/headless';
import Button from '~/lib/Button.svelte';
import Icon from '~/lib/Icon.svelte';
import { mdiCheck } from '@mdi/js';
import iconVoiceSelection from '~/assets/icons/voice-selection-300.svg?raw';

interface Props {
	lang: string
	voice: SpeechSynthesisVoice
	voices: SpeechSynthesisVoice[]
}

let {
	lang,
	voice,
	voices ,
}: Props = $props();

let open = $state<boolean>(false);
</script>
