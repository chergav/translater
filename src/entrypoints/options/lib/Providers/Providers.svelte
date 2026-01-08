<div class="flex h-full flex-col">
	<div class="flex items-center gap-1 border-b border-color-surface-high px-6 py-4">
		<div
			class="relative flex max-w-full min-w-0 items-center"
			onmouseenter={() => isInContainer = true}
			onmouseleave={() => isInContainer = false}
			role="menu"
			tabindex="-1"
		>
			{#if showScrollButtons && !scroll.arrived.left}
				<div class="absolute left-0 z-10" transition:fade={{ duration: 150 }}>
					<Button
						disabled={scroll.arrived.left}
						icon={mdiChevronLeft}
						onclick={() => scroll.x -= 300}
						title="Scroll left"
						variant="filled"
					/>
				</div>
			{/if}
			<div
				bind:this={scrollContainer}
				class="scrollbar-hidden flex max-w-full items-center gap-0.5 overflow-x-auto"
			>
				{#each providerStore.providers as provider (provider.id)}
					{@const unfinishedSetup = providerStore.isUnfinishedSetup(provider)}
					{@const activeTabProvider = provider.id === providerStore.activeTabProviderId}
					{@const selectedProvider = provider.id === providerStore.selectedProvider.id}

					<Button
						class="max-w-40"
						active={activeTabProvider}
						icon={selectedProvider ? mdiCheckCircleOutline : ''}
						iconRight={unfinishedSetup ? mdiAlertCircleOutline : ''}
						iconRightClass="text-color-error"
						label={provider.name}
						onclick={() => { providerStore.activeTabProviderId = provider.id; }}
						title={unfinishedSetup ? 'Complete the setup' : provider.name}
					/>
				{/each}
			</div>
			{#if showScrollButtons && !scroll.arrived.right}
				<div class="absolute right-0 z-10" transition:fade={{ duration: 150 }}>
					<Button
						disabled={scroll.arrived.right}
						icon={mdiChevronRight}
						onclick={() => scroll.x += 300}
						title="Scroll right"
						variant="filled"
					/>
				</div>
			{/if}
		</div>
		<Button
			class="shrink-0"
			icon={mdiPlus}
			onclick={providerStore.addProvider}
			title="Add custom provider"
		/>
	</div>

	<div class="scrollbar flex h-full flex-col overflow-y-auto pt-4 pl-6">
		{#key providerStore.activeTabProviderId}
			<Provider provider={providerStore.activeTabProvider} />
		{/key}
	</div>
</div>

<script lang="ts">
import { onMount } from 'svelte';
import { fade } from 'svelte/transition';
import { providerStore } from './providerStore.svelte';
import Button from '~/lib/Button.svelte';
import Provider from './lib/Provider.svelte';
import { mdiPlus, mdiChevronLeft, mdiChevronRight, mdiCheckCircleOutline, mdiAlertCircleOutline } from '@mdi/js';
import { ScrollState } from 'runed';
import { isBrowserTranslationAvailable } from '~/entrypoints/background/providers/browser';

let scrollContainer = $state<HTMLDivElement>();
let containerClientWidth = $state<number>();
let isInContainer = $state<boolean>(false);
const isContainerOverflow = $derived<boolean>((scrollContainer?.scrollWidth || 0) > (containerClientWidth || 0));
const showScrollButtons = $derived<boolean>(isInContainer && isContainerOverflow);

const scroll = new ScrollState({
	element: () => scrollContainer,
	behavior: 'smooth',
});

onMount(async () => {
	providerStore.isTranslationAPIAvailable = await isBrowserTranslationAvailable();
});
</script>
