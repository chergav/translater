{#if store.translated && store.showFooter}
	<div class="h-px bg-color-outline-variant"></div>
	<footer class="flex min-h-0 flex-col items-center justify-center gap-1 rounded-b-xl bg-color-surface p-1">
		<div class="flex w-full max-w-xl shrink-0 items-center gap-0.5 overflow-hidden rounded-full">
			{#each tabs as tab (tab.id)}
				{#if tab.component && Object.hasOwn(store.translated, tab.srcKey)}
					{@const isActiveTab = activeTab === tab.id}
					<ButtonGroup
						active={isActiveTab}
						icon={tab.icon}
						iconActive={tab.iconActive}
						iconRight={mdiChevronDown}
						iconRightClass={['transition-transform duration-200', isActiveTab && '-scale-y-100']}
						label={tab.label}
						onclick={() => {
							tabHandler(tab.id);
						}}
						size="xs"
					/>
				{/if}
			{/each}
		</div>
		{#if CurrentComponent}
			<div class="flex min-h-0 w-full *:-mr-1 *:min-h-0" transition:slide={{ duration: 200 }}>
				<CurrentComponent />
			</div>
		{/if}
	</footer>
{/if}

<script lang="ts">
import type { Component } from 'svelte';
import { slide } from 'svelte/transition';
import { store } from '~/entrypoints/content/store.svelte';
import ButtonGroup from '~/lib/ButtonGroup.svelte';
import Dictionary from './lib/Dictionary.svelte';
import Definitions from './lib/Definitions.svelte';
import Examples from './lib/Examples.svelte';
import {
	mdiChevronDown,
	mdiBookOpen,
	mdiBookOpenOutline,
	mdiTextBox,
	mdiTextBoxOutline,
	mdiFormatQuoteClose,
	mdiFormatQuoteCloseOutline,
} from '@mdi/js';

type Tabs = {
	id: number
	srcKey: string
	label: string
	icon: string
	iconActive: string
	component?: Component
};

let activeTab = $state<number>(0);

const tabs: Tabs[] = [
	{
		id: 0,
		srcKey: '',
		label: '',
		icon: '',
		iconActive: '',
		component: undefined,
	},
	{
		id: 1,
		srcKey: 'dict',
		label: browser.i18n.getMessage('popup_dictionary'),
		icon: mdiBookOpenOutline,
		iconActive: mdiBookOpen,
		component: Dictionary,
	},
	{
		id: 2,
		srcKey: 'definitions',
		label: browser.i18n.getMessage('popup_definitions'),
		icon: mdiTextBoxOutline,
		iconActive: mdiTextBox,
		component: Definitions,
	},
	{
		id: 3,
		srcKey: 'examples',
		label: browser.i18n.getMessage('popup_examples'),
		icon: mdiFormatQuoteCloseOutline,
		iconActive: mdiFormatQuoteClose,
		component: Examples,
	},
];

let CurrentComponent = $derived(tabs.find(t => t.id === activeTab)?.component);

const tabHandler = (tabId: number) => {
	activeTab = activeTab === tabId ? 0 : tabId;
};
</script>
