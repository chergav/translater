<Listbox
	class="relative"
	change={() => {
		storage.settings.ttsVoiceByLang[lang] = voice.name;
	}}
	bind:value={voice}
	bind:open
>
	<ListboxButton class="" as="div">
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
			w-max
			left-0
			py-1
			mt-1
			max-h-72
			overflow-auto
			text-sm
			select-none
			bg-white
			dark:bg-gray-900
			border
			border-gray-100
			dark:border-gray-800
			rounded-xl
			shadow-lg
			z-10
			scrollbar
			list-none
		"
	>
		{#each voices as voice (voice)}
			<ListboxOption
				class="
					relative
					w-full
					h-full
					pl-10
					py-1
					pr-3
					flex
					items-center
					whitespace-nowrap
					hover:bg-purple-900/10
					dark:hover:bg-purple-100/10
					aria-selected:bg-purple-900/10
					aria-selected:dark:bg-purple-100/10
					focus:bg-gray-800/10
					focus:dark:bg-gray-200/10
					focus-within:outline-0
					cursor-default
				"
				value={voice}
			>
				{#snippet children(selected)}
					{#if selected}
						<span class="absolute left-0 pl-3 text-purple-800 dark:text-purple-200">
							<Icon d={mdiCheck} />
						</span>
					{/if}
					<span class={selected ? 'text-purple-800 dark:text-purple-200 font-medium' : ''}>{voice.name}</span>
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
