<Listbox
	class="relative"
	bind:value={voice}
	on:change={() => {
		$persistentStore.ttsVoiceByLang[lang] = voice.name;
	}}
>
	<ListboxButton as="div">
		<ButtonImage
			round
			tooltip={{ title: voice.name }}
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html iconVoiceSelection}
		</ButtonImage>
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
		"
	>
		{#each voices as voice}
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
					hover:bg-gray-800/10
					dark:hover:bg-gray-200/10
					aria-selected:bg-blue-600/10
					aria-selected:dark:bg-blue-400/10
					focus:bg-gray-800/10
					focus:dark:bg-gray-200/10
					focus-within:outline-0
					cursor-default
				"
				value={voice}
				let:selected
			>
				{#if selected}
					<span class="absolute left-0 pl-3 text-blue-600">
						<Icon d={heroCheck} />
					</span>
				{/if}
				<span class={selected ? 'text-blue-600 font-medium' : ''}>{voice.name}</span>
			</ListboxOption>
		{/each}
	</ListboxOptions>
</Listbox>

<script>
import { persistentStore } from '~/common/store';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '~/lib/headless';
import ButtonImage from '~/lib/ButtonImage.svelte';
import Icon from '~/lib/Icon.svelte';
import { heroCheck } from '~/icons/heroicons';
import iconVoiceSelection from '~/icons/voice-selection-300.svg?raw';

export let voices;
export let voice;
export let lang;
</script>
