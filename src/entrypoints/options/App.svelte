<main class="flex h-screen flex-col items-center p-4">
	<div class="flex size-full flex-row gap-4">
		<div class="flex max-w-96 min-w-56 flex-col justify-between">
			<div class="flex flex-col gap-4">
				<div class="flex items-center">
					<img alt="logo" src="/icons/128.png" width="48" />
					<span class="ml-4 text-xl">Translator</span>
				</div>
				<div class="flex flex-col py-5">
					{#each Object.entries(tabs) as [hash, { Icon, IconActive, label }] (hash)}
						<NavRailItem
							active={activeTabHash === hash}
							{label}
							onclick={() => {
								activeTabHash = hash as TabsHash;
							}}
						>
							{#snippet icon(active)}
								{#if active && IconActive}
									<IconActive />
								{:else}
									<Icon />
								{/if}
							{/snippet}
						</NavRailItem>
					{/each}
				</div>
			</div>
			<div class="flex flex-col items-center gap-2">
				<RateUs />
				<TranslatorVersion />
				<Link
					class="text-sm"
					href="https://chergav.github.io/extensions/translater/onboarding/"
					label="Onboarding"
				/>
			</div>
		</div>
		<div class="flex size-full flex-col overflow-hidden rounded-3xl">
			{#key activeTabHash}
				<div
					class="scrollbar flex size-full flex-col gap-4 overflow-y-auto p-6 *:mx-auto *:w-full *:max-w-3xl"
					in:fly={{
						y: 20,
						duration: DURATION_IN,
						easing: expressiveSpatialDefault,
					}}
				>
					<CurrentComponent />
				</div>
			{/key}
		</div>
	</div>
</main>

<Toaster invert position="bottom-left" richColors theme={storage.settings.theme} />

<svelte:head>
	<title>{browser.i18n.getMessage('options_title')}</title>
</svelte:head>

<script lang="ts">
import type { Component } from 'svelte';
import { fly } from 'svelte/transition';
import { storage } from '~/shared/storage.svelte';
import NavRailItem from '~/lib/base/NavRailItem.svelte';
import Link from '~/lib/Link.svelte';
import TranslatorVersion from '~/lib/TranslatorVersion.svelte';
import RateUs from '~/lib/RateUs.svelte';
import General from './lib/General/General.svelte';
import Appearance from './lib/Appearance/Appearance.svelte';
import TTS from './lib/TTS/TTS.svelte';
import History from './lib/History/History.svelte';
import Support from './lib/Support/Support.svelte';
import Providers from './lib/Providers/Providers.svelte';
import { applyThemeString } from '~/utils/theme';
import { expressiveSpatialDefault } from '~/lib/base/utils/md3Easing';
import SettingsOutline from '~icons/material-symbols/settings-outline-rounded';
import Settings from '~icons/material-symbols/settings-rounded';
import AwesomeOutline from '~icons/material-symbols/auto-awesome-outline-rounded';
import Awesome from '~icons/material-symbols/auto-awesome-rounded';
import BrushOutline from '~icons/material-symbols/brush-outline';
import Brush from '~icons/material-symbols/brush';
import VolumeUpOutline from '~icons/material-symbols/volume-up-outline-rounded';
import VolumeUp from '~icons/material-symbols/volume-up-rounded';
import HistoryRounded from '~icons/material-symbols/history-rounded';
import HelpOutline from '~icons/material-symbols/help-outline-rounded';
import Help from '~icons/material-symbols/help-rounded';
import { Toaster } from 'svelte-sonner';

type TabsHash = '#general' | '#providers' | '#appearance' | '#tts' | '#history' | '#support';

type Tabs = {
	[key in TabsHash]: {
		label: string
		Icon: Component
		IconActive?: Component
		component: Component
	}
};

let activeTabHash = $state<TabsHash>(window.location.hash as TabsHash || '#general');
const DURATION_IN = $derived<number>(storage.motionDisabled ? 0 : 500);

const tabs: Tabs = {
	'#general': {
		label: browser.i18n.getMessage('options_tab_general'),
		Icon: SettingsOutline,
		IconActive: Settings,
		component: General,
	},
	'#providers': {
		label: 'Providers',
		Icon: AwesomeOutline,
		IconActive: Awesome,
		component: Providers,
	},
	'#appearance': {
		label: browser.i18n.getMessage('options_tab_appearance'),
		Icon: BrushOutline,
		IconActive: Brush,
		component: Appearance,
	},
	'#tts': {
		label: 'Text-to-Speech',
		Icon: VolumeUpOutline,
		IconActive: VolumeUp,
		component: TTS,
	},
	'#history': {
		label: browser.i18n.getMessage('options_tab_history'),
		Icon: HistoryRounded,
		component: History,
	},
	'#support': {
		label: browser.i18n.getMessage('options_tab_support'),
		Icon: HelpOutline,
		IconActive: Help,
		component: Support,
	},
};

let CurrentComponent = $derived(tabs[activeTabHash]?.component);

$effect(() => {
	window.location.hash = activeTabHash;
});

$effect.pre(() => {
	const root = document.documentElement;

	root.style.setProperty('color-scheme', storage.themeClass);
	root.dataset.contrast = storage.contrast;
	root.dataset.theme = storage.themeClass;
	root.dataset.themeColor = storage.settings.accentColor;
	root.classList.toggle('reduced-motion', storage.motionDisabled);

	if (storage.settings.customTheme) {
		applyThemeString(document, storage.settings.customTheme);
	}
});
</script>
