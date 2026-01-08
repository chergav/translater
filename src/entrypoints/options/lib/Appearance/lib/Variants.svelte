<div class="flex flex-wrap gap-4">
	{#each themeVariants as { value, label } (value)}
		<RadioHeadless {label} {value} bind:group={storage.settings.themeVariant}>
			<div data-theme={storage.themeClass} data-variant={value}>
				<div class="bg-color-surface-container p-5">
					<div class="rounded-2xl bg-color-surface px-3 py-1.5 text-center whitespace-nowrap">
						<p class="text-color-on-surface">Text primary</p>
						<p class="text-color-on-surface-variant">Text secondary</p>
					</div>
				</div>
			</div>
		</RadioHeadless>
	{/each}
</div>

<script lang="ts">
import { ThemeVariant } from '~/types';
import { storage } from '~/shared/storage.svelte';
import RadioHeadless from '~/lib/RadioHeadless.svelte';

const themeVariants: {
	value: ThemeVariant
	label: string
}[] = [
	{
		value: ThemeVariant.Slate,
		label: 'Slate',
	},
	{
		value: ThemeVariant.Gray,
		label: 'Gray',
	},
	{
		value: ThemeVariant.Zinc,
		label: 'Zinc',
	},
	{
		value: ThemeVariant.Neutral,
		label: 'Neutral',
	},
	{
		value: ThemeVariant.Stone,
		label: 'Stone',
	},
];
</script>
