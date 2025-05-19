<div class="flex flex-wrap gap-4">
	{#each themeVariants as { value, label } (value)}
		<RadioHeadless {label} {value} bind:group={storage.settings.themeVariant}>
			<div class="scoped" data-variant={value}>
				<div class="p-5 bg-base">
					<div class="px-3 py-1.5 bg-surface rounded-2xl text-center whitespace-nowrap">
						<p class="text-primary">Text primary</p>
						<p class="text-secondary">Text secondary</p>
					</div>
				</div>
			</div>
		</RadioHeadless>
	{/each}
</div>

<script lang="ts">
import { ThemeVariant } from '~/shared/types';
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
