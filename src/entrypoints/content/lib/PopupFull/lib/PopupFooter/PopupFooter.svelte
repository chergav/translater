{#if store.translated && store.showFooter}
	<footer class="pointer-events-none absolute inset-x-0 top-full flex min-h-0 flex-col items-center justify-center gap-1.5 px-2">
		<div
			class={[
				'flex items-center gap-0.5 rounded-full p-1',
				'pointer-events-auto bg-color-surface-bright',
				popupStore.dragging ? 'shadow-lg' : 'shadow-md',
			]}
		>
			{#each tabs as tab (tab.id)}
				{#if tab.component && Object.hasOwn(store.translated, tab.srcKey)}
					{@const isActiveTab = activeTab === tab.id}
					<Button
						class={[
							'rounded-sm first:rounded-l-2xl last:rounded-r-2xl aria-pressed:rounded-2xl',
							'aria-pressed:active:rounded-xs aria-pressed:active:first:rounded-l-2xl aria-pressed:active:last:rounded-r-2xl',
						]}
						label={tab.label}
						onclick={() => tabHandler(tab.id)}
						selected={isActiveTab}
						size="xs"
						toggle
					>
						{#snippet leadingIcon()}
							<tab.Icon />
						{/snippet}
						{#snippet selectedIcon()}
							<tab.IconActive />
						{/snippet}
						{#snippet trailingIcon(selected)}
							<KeyboardArrowDown
								class={[
									'transition-transform ease-effects-fast',
									selected && '-scale-y-100',
								]}
							/>
						{/snippet}
					</Button>
				{/if}
			{/each}
		</div>
		{#if CurrentComponent}
			<div
				class={[
					'pointer-events-auto flex w-full flex-col overflow-hidden rounded-xl',
					'bg-color-surface-bright text-sm text-color-on-surface',
					'*:scrollbar *:max-h-96 *:overflow-y-auto *:px-2 *:py-1.5',
					popupStore.dragging ? 'shadow-lg' : 'shadow-md',
				]}
				in:fly={{
					y: -20,
					duration: DURATION_IN,
					easing: expressiveSpatialFast,
				}}
				out:fly={{
					y: -20,
					duration: DURATION_OUT,
				}}
			>
				<CurrentComponent />
			</div>
		{/if}
	</footer>
{/if}

<script lang="ts">
import type { Component } from 'svelte';
import { fly } from 'svelte/transition';
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/content/store.svelte';
import { popupStore } from '~/entrypoints/content/lib/popupStore.svelte';
import Button from '~/lib/base/Button.svelte';
import Dictionary from './lib/Dictionary.svelte';
import Definitions from './lib/Definitions.svelte';
import Examples from './lib/Examples.svelte';
import { expressiveSpatialFast } from '~/lib/base/utils/md3Easing';
import KeyboardArrowDown from '~icons/material-symbols/keyboard-arrow-down-rounded';
import DictionaryOutline from '~icons/material-symbols/dictionary-outline-rounded';
import DictionaryFill from '~icons/material-symbols/dictionary-rounded';
import TextSnippetOutline from '~icons/material-symbols/text-snippet-outline-rounded';
import TextSnippet from '~icons/material-symbols/text-snippet-rounded';
import FormatQuoteOutline from '~icons/material-symbols/format-quote-outline-rounded';
import FormatQuote from '~icons/material-symbols/format-quote-rounded';

type Tabs = {
	id: number
	srcKey: string
	label: string
	Icon?: Component
	IconActive?: Component
	component?: Component
};

let activeTab = $state<number>(0);
const DURATION_IN = $derived<number>(storage.motionDisabled ? 0 : 350);
const DURATION_OUT = $derived<number>(storage.motionDisabled ? 0 : 250);

const tabs: Tabs[] = [
	{
		id: 0,
		srcKey: '',
		label: '',
		Icon: undefined,
		IconActive: undefined,
		component: undefined,
	},
	{
		id: 1,
		srcKey: 'dict',
		label: browser.i18n.getMessage('popup_dictionary'),
		Icon: DictionaryOutline,
		IconActive: DictionaryFill,
		component: Dictionary,
	},
	{
		id: 2,
		srcKey: 'definitions',
		label: browser.i18n.getMessage('popup_definitions'),
		Icon: TextSnippetOutline,
		IconActive: TextSnippet,
		component: Definitions,
	},
	{
		id: 3,
		srcKey: 'examples',
		label: browser.i18n.getMessage('popup_examples'),
		Icon: FormatQuoteOutline,
		IconActive: FormatQuote,
		component: Examples,
	},
];

let CurrentComponent = $derived(tabs.find(t => t.id === activeTab)?.component);

const tabHandler = (tabId: number) => {
	activeTab = activeTab === tabId ? 0 : tabId;
};
</script>
