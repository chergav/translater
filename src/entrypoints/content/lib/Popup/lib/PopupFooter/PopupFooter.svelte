{#if store.translated && showFooter}
	<footer class="flex flex-col">
		<div class="flex items-center gap-1">
			{#each tabs as tab (tab.id)}
				{#if tab.component && Object.hasOwn(store.translated, tab.srcKey)}
					<Button
						active={activeTab === tab.id}
						iconRight={mdiChevronDown}
						iconRightClass={activeTab === tab.id ? 'transform -scale-y-100' : ''}
						iconSize="18"
						label={tab.label}
						onclick={() => {
							tabHandler(tab.id);
						}}
						small
					/>
				{/if}
			{/each}
		</div>
		{#if CurrentComponent}
			<div transition:slide={{ duration: 250 }}>
				<CurrentComponent />
			</div>
		{/if}
	</footer>
{/if}

<script lang="ts">
import { slide } from 'svelte/transition';
import { store } from '~/entrypoints/content/store.svelte';
import Button from '~/lib/Button.svelte';
import Dictionary from './lib/Dictionary.svelte';
import Definitions from './lib/Definitions.svelte';
import Examples from './lib/Examples.svelte';
import { mdiChevronDown } from '@mdi/js';

let activeTab = $state<number>(0);
let showFooter = $derived<boolean>(
	!!store.translated?.dict ||
	!!store.translated?.definitions ||
	!!store.translated?.examples,
);

const tabs = [
	{
		id: 0,
		srcKey: '',
		label: '',
		component: undefined,
	},
	{
		id: 1,
		srcKey: 'dict',
		label: browser.i18n.getMessage('popup_dictionary'),
		component: Dictionary,
	},
	{
		id: 2,
		srcKey: 'definitions',
		label: browser.i18n.getMessage('popup_definitions'),
		component: Definitions,
	},
	{
		id: 3,
		srcKey: 'examples',
		label: browser.i18n.getMessage('popup_examples'),
		component: Examples,
	},
];

let CurrentComponent = $derived(tabs.find(t => t.id === activeTab)?.component);

const tabHandler = (tabId: number) => {
	activeTab = activeTab === tabId ? 0 : tabId;
};
</script>
