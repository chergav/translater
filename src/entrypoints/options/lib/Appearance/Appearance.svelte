<div class="scrollbar flex h-full flex-col gap-4 overflow-y-auto *:mx-auto *:w-full *:max-w-4xl">
	<h1 class="text-xl text-color-on-surface-variant">
		{browser.i18n.getMessage('options_tab_appearance')}
	</h1>

	<h2 class="text-sm font-medium text-color-on-surface-variant">
		{browser.i18n.getMessage('options_appearance_theme')}
	</h2>

	<div class="w-fit">
		<ButtonGroupRadio
			options={themes}
			bind:group={storage.settings.theme}
		/>
	</div>

	<h2 class="mt-2 text-sm font-medium text-color-on-surface-variant">
		{browser.i18n.getMessage('options_appearance_accent_color')}
	</h2>

	<div>
		<Accent />
	</div>

	<h2 class="mt-2 text-sm font-medium text-color-on-surface-variant">
		{browser.i18n.getMessage('options_appearance_bg_and_text')}
	</h2>

	<div>
		<Variants />
	</div>
</div>

<script lang="ts">
import { Theme } from '~/types';
import { storage } from '~/shared/storage.svelte';
import ButtonGroupRadio from '~/lib/ButtonGroupRadio.svelte';
import Accent from './lib/Accent.svelte';
import Variants from './lib/Variants.svelte';
import { mdiWeatherSunny, mdiWeatherNight, mdiThemeLightDark } from '@mdi/js';

const themes: {
	value: Theme
	label: string
	icon: string
}[] = [
	{
		value: Theme.Light,
		label: browser.i18n.getMessage('theme_light'),
		icon: mdiWeatherSunny,
	},
	{
		value: Theme.System,
		label: browser.i18n.getMessage('theme_system'),
		icon: mdiThemeLightDark,
	},
	{
		value: Theme.Dark,
		label: browser.i18n.getMessage('theme_dark'),
		icon: mdiWeatherNight,
	},
];
</script>
