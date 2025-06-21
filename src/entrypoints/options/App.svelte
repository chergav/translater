<main class="h-screen p-4 flex flex-col items-center">
		<div class="size-full max-w-7xl flex flex-row gap-4">
			<div class="flex flex-col justify-between">
				<div class="flex flex-col">
					<div class="pb-4 flex items-center">
						<img alt="logo" src="/icons/128.png" width="48" />
						<span class="ml-4 text-xl">Translater</span>
					</div>
					<div class="flex flex-col gap-1">
						{#each Object.entries(tabs) as [hash, tab] (hash)}
							<Button
								active={activeTabHash === hash}
								icon={tab.icon}
								label={tab.label}
								onclick={() => {
									activeTabHash = hash as TabsHash;
								}}
								tab
							/>
						{/each}
					</div>
				</div>
				<div class="flex flex-col items-center gap-2">
					<RateUs />
					<TranslaterVersion />
				</div>
			</div>
			<div class="w-full overflow-hidden bg-surface rounded-[16px]">
				<CurrentComponent />
			</div>
		</div>
</main>

<svelte:head>
	<title>{browser.i18n.getMessage('options_title')}</title>
</svelte:head>

<script lang="ts">
import type { Component } from 'svelte';
import { storage } from '~/shared/storage.svelte';
import Button from '~/lib/Button.svelte';
import TranslaterVersion from '~/lib/TranslaterVersion.svelte';
import RateUs from '~/lib/RateUs.svelte';
import ReadingAndInput from './lib/ReadingAndInput.svelte';
import PopupWindow from './lib/PopupWindow.svelte';
import Appearance from './lib/Appearance/Appearance.svelte';
import TTS from './lib/TTS/TTS.svelte';
import History from './lib/History/History.svelte';
import Support from './lib/Support/Support.svelte';
import {
	mdiTextBoxOutline,
	mdiApplicationOutline,
	mdiBrushOutline,
	mdiVolumeHigh,
	mdiHistory,
	mdiHelpCircleOutline,
} from '@mdi/js';

type TabsHash = '#inline' | '#popup' | '#appearance' | '#tts' | '#history' | '#support';

type Tabs = {
	[key in TabsHash]: {
		label: string
		icon: string
		component: Component
	}
};

let activeTabHash = $state<TabsHash>(window.location.hash as TabsHash || '#inline');

const tabs: Tabs = {
	'#inline': {
		label: browser.i18n.getMessage('options_tab_inline_translate'),
		icon: mdiTextBoxOutline,
		component: ReadingAndInput,
	},
	'#popup': {
		label: browser.i18n.getMessage('options_tab_popup_window'),
		icon: mdiApplicationOutline,
		component: PopupWindow,
	},
	'#appearance': {
		label: browser.i18n.getMessage('options_tab_appearance'),
		icon: mdiBrushOutline,
		component: Appearance,
	},
	'#tts': {
		label: 'Text-to-Speech',
		icon: mdiVolumeHigh,
		component: TTS,
	},
	'#history': {
		label: browser.i18n.getMessage('options_tab_history'),
		icon: mdiHistory,
		component: History,
	},
	'#support': {
		label: 'Support',
		icon: mdiHelpCircleOutline,
		component: Support,
	},
};

let CurrentComponent = $derived(tabs[activeTabHash]?.component);

$effect(() => {
	window.location.hash = activeTabHash;
});

$effect.pre(() => {
	document.documentElement.dataset.theme = storage.themeClass;
	document.documentElement.style.setProperty('color-scheme', storage.themeClass);
	document.documentElement.dataset.variant = storage.settings.themeVariant;
	document.documentElement.dataset.accent = storage.settings.accentColor;
});
</script>
