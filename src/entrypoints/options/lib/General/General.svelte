<div class="scrollbar flex h-full flex-col gap-4 overflow-y-auto p-6">
	<div class="text-xl">{browser.i18n.getMessage('options_tab_general')}</div>

	<SelectLanguageSimple
		label={browser.i18n.getMessage('target_lang_label')}
		bind:value={storage.settings.targetLang}
	/>

	<div class="pt-2 text-xl">{browser.i18n.getMessage('options_general_translation_button')}</div>

	<SwitchGroup>
		<Switch
			hint={browser.i18n.getMessage('options_inline_button_show_hint')}
			label={browser.i18n.getMessage('options_inline_button_show')}
			bind:checked={storage.settings.inlineButtonShow}
		/>
		<Switch
			hint={browser.i18n.getMessage('options_text_field_button_show_hint')}
			label={browser.i18n.getMessage('options_text_field_button_show')}
			bind:checked={storage.settings.textFieldButtonShow}
		/>
		<Switch
			disabled={!storage.settings.inlineButtonShow && !storage.settings.textFieldButtonShow}
			hint="{browser.i18n.getMessage('options_hide_translation_button_hint')}: {userLanguage}."
			label={browser.i18n.getMessage('options_hide_translation_button')}
			bind:checked={storage.settings.hideButtonForUserLanguage}
		/>
	</SwitchGroup>
	<div class="inline-flex flex-wrap items-center gap-2">
		<p>{browser.i18n.getMessage('options_hide_button_on_sites')}</p>
			{#each storage.settings.blacklistDomainForInline as domain, index (index)}
				<Chip content={domain}>
					{#snippet end()}
						<Button
							class="size-6"
							icon={mdiClose}
							iconSize="18"
							onclick={() => {
								deleteFromBlacklist(domain);
							}}
							size="xs"
							title="Delete"
							variant="dangerText"
						/>
					{/snippet}
				</Chip>
			{:else}
				<span class="text-sm text-color-on-surface-variant">
					{browser.i18n.getMessage('options_general_no_sites_selected')}
				</span>
				<span class="text-sm text-color-on-surface-variant">
					{browser.i18n.getMessage('options_hide_button_on_sites_empty_list')}
				</span>
			{/each}
	</div>

	<div class="pt-2 text-xl">{browser.i18n.getMessage('options_tab_popup_window')}</div>

	<PopupModeSwitch />

	<SwitchGroup>
		<Switch
			hint={browser.i18n.getMessage('options_general_show_on_selected_hint')}
			label={browser.i18n.getMessage('options_general_show_on_selected')}
			bind:checked={storage.settings.showPopupOnSelection}
		/>
		<Switch
			hint={browser.i18n.getMessage('options_lock_popup_window_hint')}
			label={browser.i18n.getMessage('options_lock_popup_window')}
			bind:checked={storage.settings.lockWindow}
		/>
		<Switch
			hint={browser.i18n.getMessage('options_show_original_text_hint')}
			label={browser.i18n.getMessage('options_show_original_text')}
			bind:checked={storage.settings.showOriginalText}
		/>
		<Switch
			hint={browser.i18n.getMessage('options_show_transliteration_hint')}
			label={browser.i18n.getMessage('options_show_transliteration')}
			bind:checked={storage.settings.showTransliteration}
		/>
	</SwitchGroup>

	<Select
		label="{browser.i18n.getMessage('options_font_size')}:"
		bind:value={storage.settings.fontSize}
	>
		{#each fontSizes as { value, label } (value)}
			<option {value}>{label}</option>
		{/each}
	</Select>
	<div class="flex flex-col items-start gap-2">
		<div class="flex w-full items-center justify-between">
			<p>{browser.i18n.getMessage('options_keyboard_shortcut_open_popup')}:</p>
			{#await shortcutKeysPromise then shortcutKeys}
				<Shortcuts keys={shortcutKeys} />
			{/await}
		</div>
		{#if import.meta.env.CHROME}
			<button
				class="cursor-pointer self-end text-sm text-color-link hover:underline"
				onclick={openExtensionsShortcuts}
				type="button"
			>
				{browser.i18n.getMessage('options_edit_keyboard_shortcut')}
			</button>
		{/if}
	</div>

	<!-- <OAuth /> -->
</div>

<script lang="ts">
import { FontSize } from '~/types';
import { storage } from '~/shared/storage.svelte';
import SelectLanguageSimple from '~/lib/SelectLanguageSimple.svelte';
import Button from '~/lib/Button.svelte';
import Select from '~/lib/Select.svelte';
import Switch from '~/lib/Switch.svelte';
import SwitchGroup from '~/lib/SwitchGroup.svelte';
import Chip from '~/lib/Chip.svelte';
import Shortcuts from '~/lib/Shortcuts.svelte';
import PopupModeSwitch from './lib/PopupModeSwitch.svelte';
import { getShortcutByCommand } from '~/shared/browser';
import { mdiClose } from '@mdi/js';
// import OAuth from './OAuth.svelte';

let userLanguage = $state<string>(getUserLanguage());

const deleteFromBlacklist = (domain: string) => {
	storage.settings.blacklistDomainForInline = storage.settings.blacklistDomainForInline.filter(i => i !== domain);
};

let shortcutKeysPromise = getShortcutByCommand('open-translator');

const openExtensionsShortcuts = () => {
	browser.tabs.create({ url: 'chrome://extensions/shortcuts' });
};

function getUserLanguage(){
	const userUILanguage = browser.i18n.getUILanguage();
	let i18nLanguage: string;
	// @ts-expect-error ignore messageName
	i18nLanguage = browser.i18n.getMessage(`language_${userUILanguage.replace('-', '_')}`);

	if (!i18nLanguage) {
		// @ts-expect-error ignore messageName
		i18nLanguage = browser.i18n.getMessage(`language_${userUILanguage.split('-')[0]}`);
	}

	return `${userUILanguage}${i18nLanguage ? ` (${i18nLanguage.toLowerCase()})`: ''}`;
}

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
