<h1 class="text-xl text-color-on-surface-variant">
	{browser.i18n.getMessage('options_tab_appearance')}
</h1>

<h2 class="text-sm font-medium text-color-on-surface-variant">
	{browser.i18n.getMessage('options_appearance_theme')}
</h2>
<div class="flex justify-center rounded-2xl bg-color-surface-bright p-4">
	<div class="flex items-center gap-0.5">
		{#each themes as { value, label, Icon, SelectedIcon } (value)}
			<ConnectedButtonRadio
				name="theme"
				{label}
				{value}
				bind:group={storage.settings.theme}
			>
				{#snippet icon()}
					<Icon />
				{/snippet}
				{#snippet selectedIcon()}
					<SelectedIcon />
				{/snippet}
			</ConnectedButtonRadio>
		{/each}
	</div>
</div>

<h2 class="text-sm font-medium text-color-on-surface-variant">
	Animations
</h2>
<div class="flex justify-center rounded-2xl bg-color-surface-bright p-4">
	<div class="flex items-center gap-0.5">
		{#each motions as { value, label, Icon, SelectedIcon } (value)}
			<ConnectedButtonRadio
				name="motion"
				{label}
				{value}
				bind:group={storage.settings.motionPreference}
			>
				{#snippet icon()}
					<Icon />
				{/snippet}
				{#snippet selectedIcon()}
					<SelectedIcon />
				{/snippet}
			</ConnectedButtonRadio>
		{/each}
	</div>
</div>

<h2 class="mt-2 text-sm font-medium text-color-on-surface-variant">Color contrast</h2>
<div class="flex justify-center rounded-2xl bg-color-surface-bright p-4">
	<Contrast />
</div>

<h2 class="mt-2 text-sm font-medium text-color-on-surface-variant">Colors</h2>
<div class="flex justify-center rounded-2xl bg-color-surface-bright px-4 py-5">
	<Color />
</div>

<script lang="ts">
import type { Component } from 'svelte';
import { Theme, MotionPreference } from '~/types';
import { storage } from '~/shared/storage.svelte';
import ConnectedButtonRadio from '~/lib/base/ConnectedButtonRadio.svelte';
import Contrast from './lib/Contrast.svelte';
import Color from './lib/Color/Color.svelte';
import LightModeOutline from '~icons/material-symbols/light-mode-outline-rounded';
import LightMode from '~icons/material-symbols/light-mode-rounded';
import DarkModeOutline from '~icons/material-symbols/dark-mode-outline-rounded';
import DarkMode from '~icons/material-symbols/dark-mode-rounded';
import ContrastIcon from '~icons/material-symbols/contrast';
import AnimationOutline from '~icons/material-symbols/animation-outline';
import Animation from '~icons/material-symbols/animation';
import DesktopWindowsOutline from '~icons/material-symbols/desktop-windows-outline-rounded';
import DesktopWindows from '~icons/material-symbols/desktop-windows-rounded';
import PauseCircleOutline from '~icons/material-symbols/pause-circle-outline-rounded';
import PauseCircle from '~icons/material-symbols/pause-circle-rounded';

const themes: {
	value: Theme
	label: string
	Icon: Component
	SelectedIcon: Component
}[] = [
	{
		value: Theme.Light,
		label: browser.i18n.getMessage('theme_light'),
		Icon: LightModeOutline,
		SelectedIcon: LightMode,
	},
	{
		value: Theme.System,
		label: browser.i18n.getMessage('theme_system'),
		Icon: ContrastIcon,
		SelectedIcon: ContrastIcon,
	},
	{
		value: Theme.Dark,
		label: browser.i18n.getMessage('theme_dark'),
		Icon: DarkModeOutline,
		SelectedIcon: DarkMode,
	},
];

const motions: {
	value: MotionPreference
	label: string
	Icon: Component
	SelectedIcon: Component
}[] = [
	{
		value: MotionPreference.On,
		label: 'Enabled',
		Icon: AnimationOutline,
		SelectedIcon: Animation,
	},
	{
		value: MotionPreference.System,
		label: 'System default',
		Icon: DesktopWindowsOutline,
		SelectedIcon: DesktopWindows,
	},
	{
		value: MotionPreference.Off,
		label: 'Reduced',
		Icon: PauseCircleOutline,
		SelectedIcon: PauseCircle,
	},
];
</script>
