<main class="
		h-screen
		p-4
		flex
		flex-col
		items-center
		text-gray-800
		bg-gray-100
		dark:text-white
		dark:bg-gray-950
		text-base
	"
>
	<div class="lg:container lg:mx-auto h-full flex flex-row gap-4">
		<div class="flex flex-col">
			<div class="pb-4 flex items-center">
				<img src={getURL('/src/icons/128.png')} width="48" alt="" />
				<span class="ml-4 text-xl">Translater</span>
			</div>
			<div class="flex flex-col">
				{#each tabs as item}
					<ButtonTab
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
		<div class="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-[16px]">
			{#each tabs as item}
				{#if activeTab === item.tab}
					<svelte:component this={item.component} />
				{/if}
			{/each}
		</div>
	</div>
</main>

<svelte:head>
	<title>{getMessage('options_title')}</title>
</svelte:head>

<script context="module">
import { loadFont } from '~/common/fontLoader';

loadFont();
</script>

<script>
import { getMessage, getURL } from '~/common/browserApi';
import { themeClass } from '~/common/store';
import ButtonTab from '~/lib/ButtonTab.svelte';
import InlineTranslate from './lib/InlineTranslate.svelte';
import PopupWindow from './lib/PopupWindow.svelte';
import Appearance from './lib/Appearance.svelte';
import History from './lib/History.svelte';
import { heroDocumentText, heroWindow, heroPaintBrush, heroClock } from '~/icons/heroicons';

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
