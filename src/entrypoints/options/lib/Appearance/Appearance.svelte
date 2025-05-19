<div class="p-6 h-full overflow-y-auto scrollbar">
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-3">
			{#each themes as { value, label } (value)}
				<Radio {label} {value} bind:group={storage.settings.theme} />
			{/each}
		</div>

		<Accent />

		<Variants />
	</div>
</div>

<script lang="ts">
import { Theme } from '~/shared/types';
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
