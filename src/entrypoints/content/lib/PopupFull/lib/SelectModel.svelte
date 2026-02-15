<Listbox
	class="relative h-min w-min text-sm"
	change={onSelectModel}
	bind:value={storage.settings.modelId}
	bind:open
>
	<ListboxButton
		class={[
			'relative flex h-8 w-52 cursor-pointer items-center overflow-hidden rounded-full pr-10 pl-3',
			'text-start whitespace-nowrap transition-colors',
			'border border-color-surface-high hover:bg-color-primary/10',
			open ? 'bg-color-primary/10' : 'bg-color-surface',
		]}
		title="{providerStore.selectedProvider.name}/{providerStore.selectedModel.model}"
	>
		<span class="block truncate">{providerStore.selectedProvider.name}/{providerStore.selectedModel.model}</span>
		<Icon
			class={[
				'pointer-events-none absolute right-1',
				open ? 'text-color-primary' : 'text-color-on-surface-variant',
			]}
			d={mdiUnfoldMoreHorizontal}
		/>
	</ListboxButton>
	<ListboxOptions
		class={[
			'absolute left-0 z-10 flex max-h-64 flex-col overflow-hidden rounded-xl shadow-lg select-none',
			'cursor-default border border-color-surface-high bg-color-surface',
		]}
	>
		<div class="scrollbar flex flex-col overflow-y-auto p-1">
			{#each providerStore.providers as provider (provider.id)}
				{@const isTranslationAPIUnAvailable = provider.id === ProviderId.TranslatorApi && !providerStore.isTranslationAPIAvailable}
				{#each provider.models as model (model.id)}
					<ListboxOption
						class={[
							'flex cursor-pointer items-center gap-2 rounded-full py-1.5 pr-2.5 pl-2 whitespace-nowrap select-none',
							'not-aria-selected:hover:bg-color-primary/5 aria-selected:bg-color-primary/10',
							'aria-disabled:pointer-events-none aria-disabled:opacity-50',
						]}
						disabled={!model.model || isTranslationAPIUnAvailable}
						value={model.id}
					>
						{#snippet children(selected)}
							<span class="inline-flex size-5">
								{#if selected}
									<Icon class="text-color-primary" d={mdiCheck} size="20" />
								{/if}
							</span>
							<span class={selected ? 'font-medium text-color-primary' : ''}>
								{provider.name}/{model.model}
							</span>
						{/snippet}
					</ListboxOption>
				{/each}
			{/each}
			<Button
				class="mt-1"
				icon={mdiOpenInNew}
				label="Manage Providers"
				onclick={openOptionsPage}
				size="xs"
				tab
			/>
		</div>
	</ListboxOptions>
</Listbox>

<script lang="ts">
import type { Message } from '~/types';
import { ProviderId } from '~/types/providers';
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/content/store.svelte';
import { providerStore } from '~/entrypoints/options/lib/Providers/providerStore.svelte';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '~/lib/headless';
import Icon from '~/lib/Icon.svelte';
import Button from '~/lib/Button.svelte';
import { mdiCheck, mdiUnfoldMoreHorizontal, mdiOpenInNew } from '@mdi/js';

let open = $state<boolean>();

function onSelectModel() {
	if (!providerStore.isSelectedProviderGoogle) {
		store.translate();
	}
}

function openOptionsPage() {
	const url = browser.runtime.getURL('/options.html') + '#providers';

	browser.runtime.sendMessage<Message>({
		type: 'openURL',
		content: { url },
	});
}
</script>
