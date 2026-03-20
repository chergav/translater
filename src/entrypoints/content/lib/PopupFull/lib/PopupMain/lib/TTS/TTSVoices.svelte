<Listbox
	class="relative leading-0"
	change={() => {
		storage.settings.ttsVoiceByLang[targetLang] = voice.name;
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
			'absolute left-1/2 z-10 -translate-x-1/2 overflow-hidden',
			'rounded-2xl bg-color-surface-container-low shadow-sm',
		]}
	>
		<div class="scrollbar max-h-72 overflow-y-auto p-1 text-sm select-none">
			{#each voices as voice (voice)}
				<ListboxOption
					class={[
						'flex cursor-pointer items-center gap-2 py-1.5 pr-2.5 pl-2 whitespace-nowrap transition-colors',
						'focus-within:outline-0 not-aria-selected:hover:bg-color-primary/5 focus:bg-color-primary/5 aria-selected:bg-color-primary/10',
						'rounded-sm first:rounded-t-xl last:rounded-b-xl',
					]}
					value={voice}
				>
					{#snippet children(selected)}
						<span class="inline-flex size-5 shrink-0">
							<Icon
								class={[
									'shrink-0 text-color-primary',
									selected ? 'inline-flex' : 'hidden',
								]}
								d={mdiCheck}
								size="18"
							/>
						</span>
						<span class={[selected && 'text-color-primary']}>{voice.name}</span>
					{/snippet}
				</ListboxOption>
			{/each}
		</div>
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
	targetLang: string
	voice: SpeechSynthesisVoice
	voices: SpeechSynthesisVoice[]
}

let {
	targetLang,
	voice,
	voices ,
}: Props = $props();

let open = $state<boolean>(false);
</script>
