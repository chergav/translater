<div class="flex justify-center">
	<div class="w-[700px]">
		<div class="py-5 flex items-center">
			<img src={getURL('/src/icons/128.png')} width="48" alt="" />
			<span class="ml-5 text-xl">Translater</span>
		</div>

		<div class="py-4 border-y border-gray-300 dark:border-gray-700">
			<SelectLang
				bind:value={$persistentStore.targetLang}
				label={getMessage('target_lang_label')}
				{languages}
			/>
		</div>

		<div class="flex flex-row py-4">
			<div class="mr-6">
				<div class="flex flex-col">
					{#each tabs as item}
						<TabFlat
							className="mb-1"
							active={activeTab === item.tab}
							label={item.label}
							icon={item.icon}
							on:click={() => {
								activeTab = item.tab;
							}}
						/>
					{/each}
				</div>
			</div>
			<div class="w-full">
				{#each tabs as item}
					{#if activeTab === item.tab}
						<svelte:component this={item.component} />
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>

<svelte:head>
	<title>{getMessage('options_title')}</title>
</svelte:head>

<script context="module">
import { loadFont } from '~/common/fontLoader';

loadFont();
</script>

<script>
import { getMessage, getURL } from '~/common/browserApi';
import { persistentStore, themeClass } from '~/common/store';
import { languages } from '~/common/settings';
import SelectLang from '~/lib/SelectLang.svelte';
import TabFlat from '~/lib/TabFlat.svelte';
import InlineTranslate from './lib/InlineTranslate.svelte';
import PopupWindow from './lib/PopupWindow.svelte';
import Appearance from './lib/Appearance.svelte';
import History from './lib/History.svelte';
import { heroDocumentText, heroWindow, heroPaintBrush, heroClock } from '@icons/heroicons';

$: document.documentElement.className = $themeClass;

let activeTab = window.location.hash || '#inline_translate';

$: window.location.hash = activeTab;

const tabs = [
	{
		tab: '#inline_translate',
		label: getMessage('options_tab_inline_translate'),
		icon: heroDocumentText,
		component: InlineTranslate,
	},
	{
		tab: '#popup_window',
		label: getMessage('options_tab_popup_window'),
		icon: heroWindow,
		component: PopupWindow,
	},
	{
		tab: '#appearance',
		label: getMessage('options_tab_appearance'),
		icon: heroPaintBrush,
		component: Appearance,
	},
	{
		tab: '#history',
		label: getMessage('options_tab_history'),
		icon: heroClock,
		component: History,
	},
];
</script>
