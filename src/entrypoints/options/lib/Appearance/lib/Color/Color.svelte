<div class="grid w-fit grid-cols-6 gap-4">
	{#each colors as { value, name } (value)}
		<label
			class="group flex cursor-pointer"
			data-contrast={storage.contrast}
			data-theme={storage.themeClass}
			data-theme-color={value}
			title={name}
		>
			<input
				name="theme-color"
				class="peer sr-only"
				aria-label="{name} theme"
				type="radio"
				{value}
				bind:group={storage.settings.accentColor}
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
				<div class="h-10 w-20 bg-color-primary"></div>
				<div class="flex">
					<div class="size-10 bg-color-secondary-container"></div>
					<div class="size-10 bg-color-tertiary-container"></div>
				</div>
			</div>
		</label>
	{/each}
	<div class="relative flex items-center justify-center">
		<label
			class="group flex cursor-pointer"
			data-contrast={storage.contrast}
			data-theme={storage.themeClass}
			data-theme-color={ThemeColor.Custom}
			title={browser.i18n.getMessage('options_appearance_custom_theme')}
		>
			<input
				name="theme-color"
				class="peer sr-only"
				aria-label={browser.i18n.getMessage('options_appearance_custom_theme')}
				type="radio"
				value={ThemeColor.Custom}
				bind:group={storage.settings.accentColor}
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
				<div class="h-10 w-20 bg-color-primary"></div>
				<div class="flex">
					<div class="size-10 bg-color-secondary-container"></div>
					<div class="size-10 bg-color-tertiary-container"></div>
				</div>
			</div>
		</label>
		{#if storage.settings.accentColor === ThemeColor.Custom}
			<div
				class="absolute -top-4 -right-4 rounded-full bg-color-on-primary p-1"
				transition:scale={{
					duration: DURATION,
					easing: expressiveSpatialFast,
				}}
			>
				<IconButton
					onclick={showDialogCustomTheme}
					title={browser.i18n.getMessage('options_appearance_edit_custom_theme')}
				>
					<Edit />
				</IconButton>
			</div>
		{/if}
		<div
			class={[
				'pointer-events-none absolute flex size-8 items-center justify-center rounded-full',
				'bg-color-primary-container text-color-on-primary-container',
			]}
		>
			<Colorize class="size-5" />
		</div>
	</div>
</div>

<DialogCustomTheme bind:open={dialogCustomThemeOpen} />

<script lang="ts">
import { ThemeColor } from '~/types';
import { scale } from 'svelte/transition';
import { storage } from '~/shared/storage.svelte';
import IconButton from '~/lib/base/IconButton.svelte';
import DialogCustomTheme from './lib/DialogCustomTheme.svelte';
import { expressiveSpatialFast } from '~/lib/base/utils/md3Easing';
import Edit from '~icons/material-symbols/edit-outline-rounded';
import Colorize from '~icons/material-symbols/colorize-outline-rounded';

let dialogCustomThemeOpen = $state<boolean>(false);
const DURATION = $derived<number>(storage.motionDisabled ? 0 : 350);

const showDialogCustomTheme = () => dialogCustomThemeOpen = true;

const colors: {
	value: ThemeColor
	name: string
}[] = [
	{
		value: ThemeColor.Monochrome,
		name: 'Monochrome',
	},
	{
		value: ThemeColor.Red,
		name: 'Red',
	},
	{
		value: ThemeColor.Amber,
		name: 'Amber',
	},
	{
		value: ThemeColor.Orange,
		name: 'Orange',
	},
	{
		value: ThemeColor.Yellow,
		name: 'Yellow',
	},
	{
		value: ThemeColor.Green,
		name: 'Green',
	},
	{
		value: ThemeColor.Teal,
		name: 'Teal',
	},
	{
		value: ThemeColor.Cyan,
		name: 'Cyan',
	},
	{
		value: ThemeColor.Blue,
		name: 'Blue',
	},
	{
		value: ThemeColor.Purple,
		name: 'Purple',
	},
	{
		value: ThemeColor.Pink,
		name: 'Pink',
	},
];
</script>
