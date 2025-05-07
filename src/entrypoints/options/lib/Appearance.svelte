<div class="p-6 flex flex-col gap-4">
	{#each themes as { value, label } (value)}
		<Radio {label} {value} bind:group={storage.settings.theme} />
	{/each}
</div>

<script lang="ts">
import { Theme } from '~/shared/types';
import { storage } from '~/shared/storage.svelte';
import Radio from '~/lib/Radio.svelte';

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
