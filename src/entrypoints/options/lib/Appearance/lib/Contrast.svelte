<div class="flex items-center gap-0.5">
	{#each contrasts as { value, label, Icon, iconOpacity } (value)}
		<ConnectedButtonRadio
			name="contrast-level"
			{label}
			{value}
			bind:group={storage.settings.contrastLevel}
		>
			{#snippet icon()}
				<Icon opacity={iconOpacity} />
			{/snippet}
		</ConnectedButtonRadio>
	{/each}
</div>

<script lang="ts">
import type { Component, ComponentProps } from 'svelte';
import { ContrastLevel } from '~/types';
import { storage } from '~/shared/storage.svelte';
import ConnectedButtonRadio from '~/lib/base/ConnectedButtonRadio.svelte';
import Eye from './Eye.svelte';

type EyeOpacity = ComponentProps<typeof Eye>['opacity'];

const contrasts: {
	value: ContrastLevel
	label: string
	Icon: Component
	iconOpacity: EyeOpacity
}[] = [
	{
		value: ContrastLevel.Default,
		label: browser.i18n.getMessage('options_appearance_contrast_default'),
		Icon: Eye,
		iconOpacity: 0.33,
	},
	{
		value: ContrastLevel.Medium,
		label: browser.i18n.getMessage('options_appearance_contrast_medium'),
		Icon: Eye,
		iconOpacity: 0.66,
	},
	{
		value: ContrastLevel.High,
		label: browser.i18n.getMessage('options_appearance_contrast_high'),
		Icon: Eye,
		iconOpacity: 1,
	},
];
</script>
