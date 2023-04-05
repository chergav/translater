<div class="flex justify-center">
	<div class="w-[650px]">
		<div class="py-5 flex items-center">
			<img src={getURL('/src/icons/48.png')} alt="" />
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
				<ul class="flex flex-col">
					{#each tabs as item}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
						<li
							class="
								px-2
								py-1.5
								mb-2
								inline-flex
								items-center
								whitespace-nowrap
								rounded-md
								hover:bg-gray-200
								dark:hover:bg-gray-700
								transition
								cursor-pointer
								{activeTab === item.tab
								? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
								: 'text-gray-500 dark:text-gray-400'}
							"
							on:click={() => {
								activeTab = item.tab;
							}}
						>
							<span>{item.label}</span>
						</li>
					{/each}
				</ul>
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
import { loadFont } from '@/common/fontLoader';

loadFont();
</script>

<script>
import { getMessage, getURL } from '@/common/browserApi';
import { persistentStore, themeClass } from '@/common/store';
import { languages } from '@/common/settings';
import SelectLang from '@/lib/SelectLang.svelte';
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
		component: InlineTranslate,
	},
	{
		tab: '#popup_window',
		label: getMessage('options_tab_popup_window'),
		component: PopupWindow,
	},
	{
		tab: '#appearance',
		label: getMessage('options_tab_appearance'),
		component: Appearance,
	},
	{
		tab: '#history',
		label: getMessage('options_tab_history'),
		component: History,
	},
];
</script>
