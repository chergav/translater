<div class="flex flex-wrap gap-4">
	{#each accentColors as { value, label } (value)}
		<RadioHeadless {label} {value} bind:group={storage.settings.accentColor}>
			<div
				class="scoped p-5 flex flex-col items-center gap-2 pointer-events-none"
				data-accent={value}
			>
				<Button active={true} icon={mdiTranslate} label="button" onclick={() => {}} />
				<p class="text-accent">Text accent</p>
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
];
</script>
