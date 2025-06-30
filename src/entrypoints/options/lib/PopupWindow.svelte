<div class="flex flex-col gap-6 p-6">
	<div class="flex flex-col gap-1">
		<Checkbox
			hint={browser.i18n.getMessage('options_lock_popup_window_hint')}
			label={browser.i18n.getMessage('options_lock_popup_window')}
			bind:checked={storage.settings.lockWindow}
		/>
		<Checkbox
			label={browser.i18n.getMessage('options_show_original_text')}
			bind:checked={storage.settings.showOriginalText}
		/>
		<Checkbox
			label={browser.i18n.getMessage('options_show_transliteration')}
			bind:checked={storage.settings.showTransliteration}
		/>
	</div>
	<Select
		label="{browser.i18n.getMessage('options_font_size')}:"
		bind:value={storage.settings.fontSize}
	>
		{#each fontSizes as { value, label } (value)}
			<option {value}>{label}</option>
		{/each}
	</Select>
	<div class="flex flex-col items-start gap-2">
		<p>{browser.i18n.getMessage('options_keyboard_shortcut_open_popup')}:</p>
		{#await shortcutKeysPromise then shortcutKeys}
			<Shortcuts keys={shortcutKeys} />
		{/await}
		{#if import.meta.env.CHROME}
			<button
				class="cursor-pointer text-sm text-blue-600 hover:underline dark:text-blue-400"
				onclick={openExtensionsShortcuts}
				type="button"
			>
				{browser.i18n.getMessage('options_edit_keyboard_shortcut')}
			</button>
		{/if}
	</div>
</div>

<script lang="ts">
import { FontSize } from '~/shared/types';
import { getShortcutByCommand } from '~/shared/browser';
import { storage } from '~/shared/storage.svelte';
import Checkbox from '~/lib/Checkbox.svelte';
import Select from '~/lib/Select.svelte';
import Shortcuts from '~/lib/Shortcuts.svelte';

let shortcutKeysPromise = getShortcutByCommand('open-translater');

const openExtensionsShortcuts = () => {
	browser.tabs.create({ url: 'chrome://extensions/shortcuts' });
};

const fontSizes: {
	value: FontSize,
	label: string
}[] = [
	{
		value: FontSize.ExtraSmall,
		label: browser.i18n.getMessage('options_font_size_xs'),
	},
	{
		value: FontSize.Small,
		label: browser.i18n.getMessage('options_font_size_sm'),
	},
	{
		value: FontSize.Normal,
		label: browser.i18n.getMessage('options_font_size_md'),
	},
	{
		value: FontSize.Large,
		label: browser.i18n.getMessage('options_font_size_lg'),
	},
	{
		value: FontSize.ExtraLarge,
		label: browser.i18n.getMessage('options_font_size_xl'),
	},
];
</script>
