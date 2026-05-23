<Dialog
	onClose={resetPreviewTheme}
	quick={storage.motionDisabled}
	bind:open
>
	{#snippet icon()}
		<Palette />
	{/snippet}
	{#snippet headline()}
		Custom color
	{/snippet}

	<div class="flex flex-col gap-4">
		<div class="flex w-full flex-col gap-2 rounded-2xl bg-color-surface p-4">
			<h2 class="mb-2 text-center text-sm font-medium text-color-on-surface-variant">Preview</h2>
			<div class="flex justify-between gap-2">
				<Button label="primary" />
				<Button color="tonal" label="secondary" />
				<Button color="text" label="tertiary" />
			</div>
			<div class="flex justify-between gap-2 text-sm font-medium">
				<span class="text-color-primary">Text primary</span>
				<span class="text-color-secondary">Text secondary</span>
				<span class="text-color-tertiary">Text tertiary</span>
			</div>
		</div>

		<!-- <div class="flex rounded-2xl bg-color-surface p-3 text-center text-sm select-none">
			<div class="flex w-full flex-col overflow-hidden rounded-xl">
				<div class="flex *:w-full *:p-2">
					<div class="bg-color-primary">
						<span class="text-color-on-primary">Primary</span>
					</div>
					<div class="bg-color-secondary">
						<span class="text-color-on-secondary">Secondary</span>
					</div>
					<div class="bg-color-tertiary">
						<span class="text-color-on-tertiary">Tertiary</span>
					</div>
				</div>
				<div class="flex flex-col *:p-2">
					<div class="bg-color-surface">
						<span class="text-color-on-surface">Surface</span>
					</div>
					<div class="bg-color-surface-container">
						<span class="text-color-on-surface">Container</span>
					</div>
				</div>
			</div>
		</div> -->

		<div class="flex flex-col gap-2 rounded-2xl bg-color-surface-bright p-4">
			<h2 class="mb-2 text-center text-sm font-medium text-color-on-surface-variant">Theme variants</h2>
			<div class="grid grid-cols-4 gap-4">
				{#each schemesPreview as { scheme, colors } (scheme)}
					<label
						class="group flex cursor-pointer"
						title={scheme.replace('-', ' ')}
					>
						<input
							name="color-scheme"
							class="peer sr-only"
							aria-label={scheme}
							type="radio"
							value={scheme}
							bind:group={storage.settings.colorScheme}
						>
						<div
							class={[
								'relative overflow-hidden rounded-40 outline-offset-4 transition-[border-radius] duration-(--shape-duration) ease-expressive-spatial-fast',
								'peer-checked:rounded-28 peer-checked:outline-4 peer-checked:outline-color-primary peer-active:rounded-2xl',
								'peer-focus-visible:outline-6',
							]}
						>
							<div
								class={[
									'pointer-events-none absolute inset-0 rounded-[inherit] bg-color-on-primary opacity-0 transition-opacity ease-effects-fast',
									'group-hover:opacity-hover group-focus-visible:opacity-pressed group-active:opacity-pressed group-disabled:opacity-disabled',
								]}
							></div>
							<div style:background-color={colors.primary} class="h-10 w-20"></div>
							<div class="flex">
								<div style:background-color={colors['secondary-container']} class="size-10"></div>
								<div style:background-color={colors['tertiary-container']} class="size-10"></div>
							</div>
						</div>
					</label>
				{/each}
			</div>
		</div>

		<div class="flex items-center justify-between rounded-2xl bg-color-surface-bright p-4">
			<div class="flex items-center gap-0.5">
				{#each themes as { value, title, Icon, SelectedIcon } (value)}
					<ConnectedButtonRadio
						name="theme-preview"
						color="tonal"
						{title}
						{value}
						bind:group={themePreview}
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
			<div class="flex items-center gap-0.5">
				{#each contrasts as { value, title, Icon, iconOpacity } (value)}
					<ConnectedButtonRadio
						name="contrasts-preview"
						color="tonal"
						{title}
						{value}
						bind:group={storage.settings.contrastLevel}
					>
						{#snippet icon()}
							<Icon opacity={iconOpacity} />
						{/snippet}
					</ConnectedButtonRadio>
				{/each}
			</div>
		</div>

		<label class="group relative flex w-full cursor-pointer rounded-2xl bg-color-surface-bright p-4 select-none">
			<div
				class={[
					'pointer-events-none absolute inset-0 rounded-[inherit] bg-color-on-surface opacity-0 transition-opacity ease-effects-fast',
					'group-hover:opacity-hover group-focus-visible:opacity-pressed group-active:opacity-pressed group-disabled:opacity-disabled',
				]}
			></div>
			<div class="relative flex w-full items-center justify-between">
				<div class="flex flex-col">
					<span class="text-color-on-surface">Source color</span>
					<span class="text-sm text-color-on-surface-variant">Select a color to generate themes</span>
				</div>
				<input
					class="sr-only self-end"
					type="color"
					bind:value={() => customColor,
						v => {
							customColor = v;
							throttledUpdate();
						}}
				>
				<div
					style:background-color={customColor}
					class="size-12 rounded-full"
				></div>
			</div>
		</label>
	</div>

	{#snippet actions()}
		<Button color="text" label="Cancel" onclick={resetPreviewTheme} />
		<Button color="text" label="Apply" onclick={generateAndApplyTheme} />
	{/snippet}
</Dialog>

<script lang="ts">
import type { Component, ComponentProps } from 'svelte';
import type { Scheme } from '~/utils/material-color-helpers.js';
import { Theme, ThemeColor, ContrastLevel } from '~/types';
import { storage } from '~/shared/storage.svelte';
import Button from '~/lib/base/Button.svelte';
import ConnectedButtonRadio from '~/lib/base/ConnectedButtonRadio.svelte';
import Dialog from '~/lib/base/Dialog.svelte';
import Palette from '~icons/material-symbols/palette-outline';
import LightModeOutline from '~icons/material-symbols/light-mode-outline-rounded';
import LightMode from '~icons/material-symbols/light-mode-rounded';
import DarkModeOutline from '~icons/material-symbols/dark-mode-outline-rounded';
import DarkMode from '~icons/material-symbols/dark-mode-rounded';
import { useThrottle } from 'runed';
import {
	type SchemePreview,
	buildCustomThemeCSSPreview,
	buildCustomThemeCSS,
	applyThemeString,
	generateSchemesPreview,
} from '~/utils/theme';
import Eye from '~/entrypoints/options/lib/Appearance/lib/Eye.svelte';

type EyeOpacity = ComponentProps<typeof Eye>['opacity'];

interface Props  {
	open: boolean
}

let {
	open = $bindable(false),
}: Props = $props();

let customColor = $state<string>(storage.settings.seedColor);
let throttledCustomColor = $state<string>(storage.settings.seedColor);
let themePreview = $derived<Theme>(storage.themeClass);
let isDark = $derived<boolean>(themePreview === 'dark');
let contrastLevel = $derived<number>(storage.settings.contrastLevel);
const schemesPreview = $derived<SchemePreview[]>(generateSchemesPreview(throttledCustomColor, isDark, contrastLevel));
const throttledUpdate = useThrottle(() => { throttledCustomColor = customColor; }, 100);

function resetPreviewTheme() {
	open = false;
	applyThemeString(document, storage.settings.customTheme);
	contrastLevel = storage.settings.contrastLevel;
	themePreview = storage.themeClass;
	customColor = storage.settings.seedColor;
	throttledCustomColor = storage.settings.seedColor;
}

function applyPreviewTheme(hexColor: string, contrastLevel: number, scheme: Scheme) {
	// console.log('applyPreviewTheme');
	const cssTheme = buildCustomThemeCSSPreview(hexColor, isDark, contrastLevel, scheme);
	applyThemeString(document, cssTheme);
}

function generateAndApplyTheme() {
	const cssTheme = buildCustomThemeCSS(customColor, storage.settings.colorScheme);
	storage.settings.seedColor = customColor;
	storage.settings.customTheme = cssTheme;
	storage.settings.accentColor = ThemeColor.Custom;
	storage.settings.theme = themePreview;
	storage.settings.contrastLevel = contrastLevel;
	open = false;
}

const themes: {
	value: Theme
	title: string
	Icon: Component
	SelectedIcon: Component
}[] = [
	{
		value: Theme.Light,
		title: browser.i18n.getMessage('theme_light'),
		Icon: LightModeOutline,
		SelectedIcon: LightMode,
	},
	{
		value: Theme.Dark,
		title: browser.i18n.getMessage('theme_dark'),
		Icon: DarkModeOutline,
		SelectedIcon: DarkMode,
	},
];

// const themes: {
// 	value: Theme
// 	title: string
// 	icon: string
// }[] = [
// 	{
// 		value: Theme.Light,
// 		title: 'Light theme',
// 		icon: mdiWeatherSunny,
// 	},
// 	{
// 		value: Theme.Dark,
// 		title: 'Dark theme',
// 		icon: mdiWeatherNight,
// 	},
// ];

const contrasts: {
	value: ContrastLevel
	title: string
	Icon: Component
	iconOpacity: EyeOpacity
}[] = [
	{
		value: ContrastLevel.Default,
		title: 'Default contrast',
		Icon: Eye,
		iconOpacity: 0.33,
	},
	{
		value: ContrastLevel.Medium,
		title: 'Medium contrast',
		Icon: Eye,
		iconOpacity: 0.66,
	},
	{
		value: ContrastLevel.High,
		title: 'High contrast',
		Icon: Eye,
		iconOpacity: 1,
	},
];

$effect(() => {
	if (open) {
		applyPreviewTheme(throttledCustomColor, contrastLevel, storage.settings.colorScheme);
	}
});
</script>
