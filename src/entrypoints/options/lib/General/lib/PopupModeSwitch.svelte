<div class="flex w-full justify-center select-none">
	<div class="flex items-center gap-0.5 overflow-hidden rounded-full">
		{#each modes as { value, label, hint, icon } (value)}
			<label
				class={[
					'group flex cursor-pointer flex-col items-center',
					'bg-color-surface-container transition-[background-color,border-radius]',
					'rounded-lg has-checked:rounded-[40px]',
					'hover:bg-color-surface-high/100 has-active:bg-color-surface-highest/100',
					'has-checked:bg-color-primary/100 has-active:has-checked:bg-color-primary/90',
				]}
			>
				<input class="peer sr-only" type="radio" {value} bind:group={storage.settings.popupMode} />
				<div class="flex w-full items-center gap-4 px-6 py-3">
					<div class="text-color-on-surface-variant group-has-checked:text-color-on-primary">
						<Icon d={icon} />
					</div>
					<div class="flex flex-col gap-0.5">
						<span class="text-color-on-surface group-has-checked:text-color-on-primary">{label}</span>
						<span class="text-sm text-color-on-surface-variant group-has-checked:text-color-on-primary-variant">{hint}</span>
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
import { mdiArrowExpand, mdiArrowCollapse } from '@mdi/js';

const modes: {
	value: PopupMode
	label: string
	hint: string
	icon: string
}[] = [
	{
		value: PopupMode.Full,
		label: browser.i18n.getMessage('options_general_mode_full'),
		hint: browser.i18n.getMessage('options_general_mode_full_hint'),
		icon: mdiArrowExpand,
	},
	{
		value: PopupMode.Simple,
		label: browser.i18n.getMessage('options_general_mode_simple'),
		hint: browser.i18n.getMessage('options_general_mode_simple_hint'),
		icon: mdiArrowCollapse,
	},
];
</script>
