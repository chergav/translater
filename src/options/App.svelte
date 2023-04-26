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

$: document.documentElement.className = $themeClass;

let activeTab = window.location.hash || '#inline_translate';

$: window.location.hash = activeTab;

const tabs = [
	{
		tab: '#inline_translate',
		label: getMessage('options_tab_inline_translate'),
		icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
			</svg>`,
		component: InlineTranslate,
	},
	{
		tab: '#popup_window',
		label: getMessage('options_tab_popup_window'),
		icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zM7.5 6h.008v.008H7.5V6zm2.25 0h.008v.008H9.75V6z" />
			</svg>`,
		component: PopupWindow,
	},
	{
		tab: '#appearance',
		label: getMessage('options_tab_appearance'),
		icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
			</svg>`,
		component: Appearance,
	},
	{
		tab: '#history',
		label: getMessage('options_tab_history'),
		icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>`,
		component: History,
	},
];
</script>
