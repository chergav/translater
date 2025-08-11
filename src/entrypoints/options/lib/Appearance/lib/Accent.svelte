<div class="flex flex-wrap gap-4">
	{#each accentColors as { value, label } (value)}
		<RadioHeadless {label} {value} bind:group={storage.settings.accentColor}>
			<div data-accent={value} data-theme={storage.themeClass}>
				<div class="flex flex-col items-center gap-2 p-5">
					<Button active={true} icon={mdiTranslate} label="button" />
					<p class="text-color-primary">Text accent</p>
				</div>
			</div>
		</RadioHeadless>
	{/each}
</div>

<script lang="ts">
import { AccentColor } from '~/shared/types';
import { storage } from '~/shared/storage.svelte';
import RadioHeadless from '~/lib/RadioHeadless.svelte';
import Button from '~/lib/Button.svelte';
import { mdiTranslate } from '@mdi/js';

const accentColors: {
	value: AccentColor
	label: string
}[] = [
	{
		value: AccentColor.Amber,
		label: 'Amber',
	},
	{
		value: AccentColor.Green,
		label: 'Green',
	},
	{
		value: AccentColor.Blue,
		label: 'Blue',
	},
	{
		value: AccentColor.Purple,
		label: 'Purple',
	},
	{
		value: AccentColor.Pink,
		label: 'Pink',
	},
	{
		value: AccentColor.Neutral,
		label: 'Neutral',
	},
];
</script>
