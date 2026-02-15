<div class="scrollbar flex h-full flex-col gap-4 overflow-y-auto p-6">
	<div class="text-xl">{browser.i18n.getMessage('options_appearance_theme')}</div>
	<div class="flex flex-col gap-1">
		{#each themes as { value, label } (value)}
			<Radio {label} {value} bind:group={storage.settings.theme} />
		{/each}
	</div>
	<div class="pt-2 text-xl">{browser.i18n.getMessage('options_appearance_accent_color')}</div>
	<Accent />
	<div class="pt-2 text-xl">{browser.i18n.getMessage('options_appearance_bg_and_text')}</div>
	<Variants />
</div>

<script lang="ts">
import { Theme } from '~/types';
import { storage } from '~/shared/storage.svelte';
import Radio from '~/lib/Radio.svelte';
import Accent from './lib/Accent.svelte';
import Variants from './lib/Variants.svelte';

const themes: {
	value: Theme
	label: string
}[] = [
	{
		value: Theme.Light,
		label: browser.i18n.getMessage('theme_light'),
	},
	{
		value: Theme.Dark,
		label: browser.i18n.getMessage('theme_dark'),
	},
	{
		value: Theme.System,
		label: browser.i18n.getMessage('theme_system'),
	},
];
</script>
