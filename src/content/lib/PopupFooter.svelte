{#if $store.translated}
	<footer>
		<div class="flex items-center justify-between">
			<div class="flex gap-1">
				{#each tabs as item}
					{#if item.component && $store.translated[item.srcKey]}
						<ButtonTab
							class="mt-1"
							active={activeTab === item.tab}
							label={item.label}
							small
							on:click={() => {
								tabHandler(item.tab);
							}}
						>
							<Icon
								class="
									ml-1
									{activeTab === item.tab ? 'transform -scale-y-100' : ''}
								"
								d={heroChevronDown}
								size="sm"
							/>
						</ButtonTab>
					{/if}
				{/each}
			</div>
		</div>

		<div>
			{#each tabs as item}
				{#if activeTab === item.tab}
					<div transition:slide|local={{ duration: 250, easing: cubicInOut }}>
						<svelte:component this={item.component} />
					</div>
				{/if}
			{/each}
		</div>
	</footer>
{/if}

<script>
import { slide } from 'svelte/transition';
import { store } from '~/content/store';
import { cubicInOut } from 'svelte/easing';
import { getMessage } from '~/common/browserApi';
import ButtonTab from '~/lib/ButtonTab.svelte';
import Dictionary from '~/content/lib/Dictionary.svelte';
import Definitions from '~/content/lib/Definitions.svelte';
import Examples from '~/content/lib/Examples.svelte';
import Icon from '~/lib/Icon.svelte';
import { heroChevronDown } from '~/icons/heroicons';

let activeTab = 0;

const tabs = [
	{ tab: 0, srcKey: false, label: '', component: false },
	{
		tab: 1,
		srcKey: 'dict',
		label: getMessage('popup_dictionary'),
		component: Dictionary
	},
	{
		tab: 2,
		srcKey: 'definitions',
		label: getMessage('popup_definitions'),
		component: Definitions
	},
	{
		tab: 3,
		srcKey: 'examples',
		label: getMessage('popup_examples'),
		component: Examples
	}
];

const tabHandler = tab => {
	activeTab = activeTab === tab ? 0 : tab;
};
</script>
