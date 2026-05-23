<Listbox
	onchange={onSelectModel}
	quick={storage.motionDisabled}
	bind:value={storage.settings.modelId}
>
	{#snippet listboxButton()}
		<ListboxButton
			class="max-w-52"
			lowAccent
			size="xs"
			title="{providerStore.selectedProvider.name}/{providerStore.selectedModel.model}"
		>
			{providerStore.selectedProvider.name}/{providerStore.selectedModel.model}
		</ListboxButton>
	{/snippet}

	{#each providerStore.providers as provider (provider.id)}
		{@const isTranslationAPIUnAvailable = provider.id === ProviderId.TranslatorApi && !providerStore.isTranslationAPIAvailable}
		{#each provider.models as model (model.id)}
			<ListboxOption
				disabled={!model.model || isTranslationAPIUnAvailable}
				label="{provider.name}/{model.model}"
				size="xs"
				value={model.id}
			>
				{#snippet leadingIcon(selected)}
					{#if selected}
						<Check />
					{/if}
				{/snippet}
			</ListboxOption>
		{/each}
	{/each}
</Listbox>

<script lang="ts">
// import type { Message } from '~/types';
import { ProviderId } from '~/types/providers';
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/content/store.svelte';
import { providerStore } from '~/entrypoints/options/lib/Providers/providerStore.svelte';
import { Listbox, ListboxOption, ListboxButton } from '~/lib/base/Listbox';
import Check from '~icons/material-symbols/check-rounded';
// import OpenInNew from '~icons/material-symbols/open-in-new-rounded';

function onSelectModel() {
	if (!providerStore.isSelectedProviderGoogle) {
		store.translate();
	}
}

// function openOptionsPage() {
// 	const url = browser.runtime.getURL('/options.html') + '#providers';
// 	browser.runtime.sendMessage<Message>({
// 		type: 'openURL',
// 		content: { url },
// 	});
// }
</script>
