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
			small
			title={voice.name}
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html iconVoiceSelection}
		</Button>
	</ListboxButton>
	<ListboxOptions
		class="
			absolute
			left-0
			py-1
			max-h-72
			text-sm
			bg-surface
			border
			border-variant-200-800
			rounded-xl
			shadow-lg
			list-none
			select-none
			overflow-y-auto
			scrollbar
			z-10
		"
	>
		{#each voices as voice (voice)}
			<ListboxOption
				class="
					pl-2
					pr-2.5
					py-1
					flex
					items-center
					gap-2
					not-aria-selected:hover:bg-accent-primary/5
					aria-selected:bg-accent-primary/10
					focus:bg-accent-primary/5
					focus-within:outline-0
					cursor-pointer
					whitespace-nowrap
				"
				value={voice}
			>
				{#snippet children(selected)}
					<span class="size-[18px] inline-flex">
						<Icon class="{selected ? 'inline-flex' : 'hidden'} text-accent" d={mdiCheck} size="18" />
					</span>
					<span class={selected ? 'text-accent font-medium' : ''}>{voice.name}</span>
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
