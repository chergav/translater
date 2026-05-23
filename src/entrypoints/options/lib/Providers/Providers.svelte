<div class="flex items-start gap-4 rounded-3xl bg-color-surface-container-high p-4">
	<div class="scrollbar flex w-full max-w-48 flex-col overflow-y-auto p-1">
		<div class="mb-4">
			<Button
				label="Add provider"
				onclick={providerStore.addProvider}
				title="Add custom provider"
			>
				{#snippet leadingIcon()}
					<Add />
				{/snippet}
			</Button>
		</div>
		{#each providerStore.providers as provider (provider.id)}
			{@const unfinishedSetup = providerStore.isUnfinishedSetup(provider)}
			{@const activeTabProvider = provider.id === providerStore.activeTabProviderId}
			{@const selectedProvider = provider.id === providerStore.selectedProvider.id}

			<NavRailItem
				active={activeTabProvider}
				label={provider.name}
				onclick={() => { providerStore.activeTabProviderId = provider.id; }}
				size="sm"
				title={unfinishedSetup ? 'Complete the setup' : provider.name}
			>
				{#snippet icon()}
					{#if selectedProvider}
						<CheckCircle />
					{/if}
				{/snippet}
			</NavRailItem>
		{/each}
	</div>

	<div class="scrollbar flex w-full flex-col overflow-y-auto rounded-2xl bg-color-surface-bright p-4">
		{#key providerStore.activeTabProviderId}
			<Provider provider={providerStore.activeTabProvider} />
		{/key}
	</div>
</div>

<script lang="ts">
import { onMount } from 'svelte';
import { providerStore } from './providerStore.svelte';
import Button from '~/lib/base/Button.svelte';
import NavRailItem from '~/lib/base/NavRailItem.svelte';
import Provider from './lib/Provider.svelte';
import { isBrowserTranslationAvailable } from '~/entrypoints/background/providers/browser';
import Add from '~icons/material-symbols/add-rounded';
import CheckCircle from '~icons/material-symbols/check-circle-rounded';

onMount(async () => {
	providerStore.isTranslationAPIAvailable = await isBrowserTranslationAvailable();
});
</script>
