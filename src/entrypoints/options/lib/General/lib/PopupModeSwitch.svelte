<div class="flex w-full justify-center">
	<div class="flex items-center gap-2 rounded-3xl bg-color-surface-container p-2">
		{#each modes as { value, label, hint } (value)}
			<label
				class={[
					'group flex cursor-pointer flex-col items-center rounded-2xl transition-colors select-none',
					'hover:bg-color-surface-high/100 has-active:bg-color-surface-highest/100',
					'has-checked:bg-color-primary/10 has-active:has-checked:bg-color-primary/15',
					'has-focus-visible:outline-custom has-focus-visible:outline-color-primary',
				]}
			>
				<input class="peer sr-only" type="radio" {value} bind:group={storage.settings.popupMode} />
				<div class="flex w-full items-center gap-4 px-4 py-2">
					<div
						class={[
							'flex size-6 shrink-0 items-center justify-center rounded-full transition-colors',
							'border-2 border-color-outline bg-color-surface/100 text-color-on-primary',
							'group-has-checked:border-color-primary group-has-checked:bg-color-primary/100',
						]}
					>
						<Icon class="invisible group-has-checked:visible" d={mdiCheck} size="20" />
					</div>
					<div class="flex flex-col gap-1">
						<span>{label}</span>
						<span class="text-sm text-color-on-surface-variant">{hint}</span>
					</div>
				</div>
			</label>
		{/each}
	</div>
</div>

<script lang="ts">
import { PopupMode } from '~/types';
import { storage } from '~/shared/storage.svelte';
import Icon from '~/lib/Icon.svelte';
import { mdiCheck } from '@mdi/js';

const modes: {
	value: PopupMode
	label: string
	hint: string
}[] = [
	{
		value: PopupMode.Full,
		label: browser.i18n.getMessage('options_general_mode_full'),
		hint: browser.i18n.getMessage('options_general_mode_full_hint'),
	},
	{
		value: PopupMode.Simple,
		label: browser.i18n.getMessage('options_general_mode_simple'),
		hint: browser.i18n.getMessage('options_general_mode_simple_hint'),
	},
];
</script>
