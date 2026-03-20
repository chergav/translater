<Listbox
	class="relative h-min w-min text-sm select-none"
	change={onSelectModel}
	bind:value={storage.settings.modelId}
	bind:open
>
	<ListboxButton
		class={[
			'relative flex h-8 w-52 cursor-pointer items-center overflow-hidden rounded-sm pr-8 pl-2',
			'text-start whitespace-nowrap transition-colors active:bg-color-primary/20',
			open ? 'bg-color-primary/10' : 'bg-color-surface-container-low hover:bg-color-primary/10',
		]}
		title="{providerStore.selectedProvider.name}/{providerStore.selectedModel.model}"
	>
		<span class="block truncate font-medium">
			{providerStore.selectedProvider.name}/{providerStore.selectedModel.model}
		</span>
		<Icon
			class={[
				'pointer-events-none absolute right-1 text-color-on-surface-variant transition-transform',
				open && '-scale-y-100',
			]}
			d={mdiChevronDown}
			size="18"
		/>
	</ListboxButton>
	<ListboxOptions class="absolute left-0 z-10 flex cursor-default flex-col">
		<div
			class="flex flex-col gap-0.5"
			onpointerdown={e => e.stopPropagation()}
			role="presentation"
		>
			<div
				class={[
					'scrollbar flex max-h-64 flex-col overflow-y-auto rounded-t-2xl rounded-b-lg p-1 shadow-sm',
					'bg-color-surface-container-low',
				]}
			>
				{#each providerStore.providers as provider (provider.id)}
					{@const isTranslationAPIUnAvailable = provider.id === ProviderId.TranslatorApi && !providerStore.isTranslationAPIAvailable}
					{#each provider.models as model (model.id)}
						<ListboxOption
							class={[
								'flex cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-2.5 pl-2 whitespace-nowrap first:rounded-t-xl',
								'transition-colors not-aria-selected:hover:bg-color-primary/5 aria-selected:bg-color-primary/10',
								'aria-disabled:pointer-events-none aria-disabled:opacity-50',
							]}
							disabled={!model.model || isTranslationAPIUnAvailable}
							value={model.id}
						>
							{#snippet children(selected)}
								<span class="inline-flex size-5">
									{#if selected}
										<Icon class="text-color-primary" d={mdiCheck} size="18" />
									{/if}
								</span>
								<span class={['font-medium', selected && 'text-color-primary']}>
									{provider.name}/{model.model}
								</span>
							{/snippet}
						</ListboxOption>
					{/each}
				{/each}
			</div>
			<div class="flex flex-col rounded-t-lg rounded-b-2xl bg-color-surface-container-low p-1 shadow-sm">
				<Button
					class="rounded-b-xl"
					icon={mdiOpenInNew}
					label="Manage Providers"
					menu
					onclick={openOptionsPage}
					size="xs"
					tab
				/>
			</div>
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
import { mdiCheck, mdiChevronDown, mdiOpenInNew } from '@mdi/js';

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
