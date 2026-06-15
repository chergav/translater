<h1 class="text-xl text-color-on-surface-variant">
	{browser.i18n.getMessage('options_tab_general')}
</h1>

<h2 class="text-sm font-medium text-color-on-surface-variant">
	{browser.i18n.getMessage('options_select_langs_title')}
</h2>

<SegmentedList>
	<SelectLanguageSimple
		autoLang
		label={browser.i18n.getMessage('select_lang_source')}
		bind:value={storage.settings.sourceLang}
	>
		{#snippet labelIcon()}
			<Input />
		{/snippet}
	</SelectLanguageSimple>

	<SelectLanguageSimple
		label={browser.i18n.getMessage('select_lang_target')}
		bind:value={storage.settings.targetLang}
	>
		{#snippet labelIcon()}
			<Output />
		{/snippet}
	</SelectLanguageSimple>
</SegmentedList>

<h2 class="mt-2 text-sm font-medium text-color-on-surface-variant">
	{browser.i18n.getMessage('options_general_translation_button')}
</h2>

<SegmentedList>
	<Switch
		hint={browser.i18n.getMessage('options_inline_button_show_hint')}
		label={browser.i18n.getMessage('options_inline_button_show')}
		bind:checked={storage.settings.inlineButtonShow}
	>
		{#snippet icon()}
			<TextSelectEnd />
		{/snippet}
	</Switch>
	<Switch
		hint={browser.i18n.getMessage('options_text_field_button_show_hint')}
		label={browser.i18n.getMessage('options_text_field_button_show')}
		bind:checked={storage.settings.textFieldButtonShow}
	>
		{#snippet icon()}
			<EditNote />
		{/snippet}
	</Switch>
	<Switch
		disabled={!storage.settings.inlineButtonShow && !storage.settings.textFieldButtonShow}
		hint="{browser.i18n.getMessage('options_hide_translation_button_hint')}: {targetLang}"
		label={browser.i18n.getMessage('options_hide_translation_button')}
		bind:checked={storage.settings.hideButtonForUserLanguage}
	>
		{#snippet icon()}
			<DoNotDisturbOn />
		{/snippet}
	</Switch>
</SegmentedList>

<SegmentedList>
	<div class="ignore-active flex items-center gap-3 p-3 select-none">
		<span class="text-color-on-surface-variant">
			<VisibilityOff class="size-5" />
		</span>
		<div class="inline-flex flex-wrap items-center gap-2">
			<p>{browser.i18n.getMessage('options_hide_button_on_sites')}:</p>
			{#each storage.settings.blacklistDomainForInline as domain, index (index)}
				<Chip content={domain}>
					{#snippet end()}
						<IconButton
							class="size-6"
							color="standard"
							onclick={() => {
								deleteFromBlacklist(domain);
							}}
							size="xs"
							title="Delete"
						>
							<Close />
						</IconButton>
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
	</div>
</SegmentedList>

<h2 class="mt-2 text-sm font-medium text-color-on-surface-variant">
	{browser.i18n.getMessage('options_tab_popup_window')}
</h2>

<SegmentedList>
	{#each modes as { value, label, hint, Icon } (value)}
		<Radio
			name="popupMode"
			{hint}
			{label}
			{value}
			variant="expressive"
			bind:group={storage.settings.popupMode}
		>
			{#snippet icon()}
				<Icon />
			{/snippet}
		</Radio>
	{/each}
</SegmentedList>

<SegmentedList>
	<Switch
		hint={browser.i18n.getMessage('options_general_show_on_selected_hint')}
		label={browser.i18n.getMessage('options_general_show_on_selected')}
		bind:checked={storage.settings.showPopupOnSelection}
	>
		{#snippet icon()}
			<Acute />
		{/snippet}
	</Switch>
	<Switch
		hint={browser.i18n.getMessage('options_lock_popup_window_hint')}
		label={browser.i18n.getMessage('options_lock_popup_window')}
		bind:checked={storage.settings.lockWindow}
	>
		{#snippet icon()}
			<Lock />
		{/snippet}
	</Switch>
	<Switch
		hint={browser.i18n.getMessage('options_show_langs_simple_hint')}
		label={browser.i18n.getMessage('options_show_langs_simple')}
		bind:checked={storage.settings.simpleModeShowLangs}
	>
		{#snippet icon()}
			<Language />
		{/snippet}
	</Switch>
	<Switch
		hint={browser.i18n.getMessage('options_show_original_text_hint')}
		label={browser.i18n.getMessage('options_show_original_text')}
		bind:checked={storage.settings.showOriginalText}
	>
		{#snippet icon()}
			<TextAd />
		{/snippet}
	</Switch>
	<Switch
		hint={browser.i18n.getMessage('options_show_transliteration_hint')}
		label={browser.i18n.getMessage('options_show_transliteration')}
		bind:checked={storage.settings.showTransliteration}
	>
		{#snippet icon()}
			<Abc />
		{/snippet}
	</Switch>
</SegmentedList>

<SegmentedList>
	<Select
		label={browser.i18n.getMessage('options_font_size')}
		size="xs"
		bind:value={storage.settings.fontSize}
	>
		{#snippet labelIcon()}
			<FormatSize />
		{/snippet}
		{#each fontSizes as { value, label } (value)}
			<option {value}>{label}</option>
		{/each}
	</Select>
	<div class="flex items-center gap-3 rounded-sm p-3">
		<span>
			<Keyboard class="size-5 text-color-on-surface-variant" />
		</span>
		<div class="flex w-full items-center justify-between select-none">
			<p>{browser.i18n.getMessage('options_keyboard_shortcut_open_popup')}:</p>
			{#await shortcutKeysPromise then shortcutKeys}
				<Shortcuts class="bg-color-surface-bright" keys={shortcutKeys} />
			{/await}
		</div>
		{#if import.meta.env.CHROME}
			<div>
				<IconButton
					color="standard"
					onclick={openExtensionsShortcuts}
					size="xs"
					title={browser.i18n.getMessage('options_edit_keyboard_shortcut')}
				>
					<Edit />
				</IconButton>
			</div>
		{/if}
	</div>
</SegmentedList>

	<!-- <OAuth /> -->

<script lang="ts">
import type { Component } from 'svelte';
import { FontSize, PopupMode } from '~/types';
import { storage } from '~/shared/storage.svelte';
import SelectLanguageSimple from '~/lib/SelectLanguageSimple.svelte';
import IconButton from '~/lib/base/IconButton.svelte';
import Select from '~/lib/base/Select.svelte';
import Radio from '~/lib/base/Radio.svelte';
import Switch from '~/lib/base/Switch.svelte';
import SegmentedList from '~/lib/base/SegmentedList.svelte';
import Chip from '~/lib/base/Chip.svelte';
import Shortcuts from '~/lib/Shortcuts.svelte';
import { getShortcutByCommand } from '~/shared/browser';
import { getDisplayedLanguageName } from '~/shared/languages';
import FormatSize from '~icons/material-symbols/format-size-rounded';
import Edit from '~icons/material-symbols/edit-outline-rounded';
import Keyboard from '~icons/material-symbols/keyboard-alt-outline-rounded';
import ModeFull from '~icons/material-symbols/open-in-full-rounded';
import ModeSimple from '~icons/material-symbols/close-fullscreen-rounded';
import Close from '~icons/material-symbols/close-rounded';
import Input from '~icons/material-symbols/input-rounded';
import Output from '~icons/material-symbols/output-rounded';
import VisibilityOff from '~icons/material-symbols/visibility-off-outline-rounded';
import TextSelectEnd from '~icons/material-symbols/text-select-end-rounded';
import EditNote from '~icons/material-symbols/edit-note-outline-rounded';
import DoNotDisturbOn from '~icons/material-symbols/do-not-disturb-on-outline-rounded';
import Acute from '~icons/material-symbols/acute-outline-rounded';
import Lock from '~icons/material-symbols/lock-outline';
import Language from '~icons/material-symbols/language';
import TextAd from '~icons/material-symbols/text-ad-outline-rounded';
import Abc from '~icons/material-symbols/abc-rounded';

// import OAuth from './OAuth.svelte';

let targetLang = $derived<string>(getDisplayedLanguageName(storage.settings.targetLang, 'name+code'));

const deleteFromBlacklist = (domain: string) => {
	storage.settings.blacklistDomainForInline = storage.settings.blacklistDomainForInline.filter(i => i !== domain);
};

let shortcutKeysPromise = getShortcutByCommand('open-translator');

const openExtensionsShortcuts = () => {
	browser.tabs.create({ url: 'chrome://extensions/shortcuts' });
};

const modes: {
	value: PopupMode
	label: string
	hint: string
	Icon: Component
}[] = [
	{
		value: PopupMode.Full,
		label: browser.i18n.getMessage('options_general_mode_full'),
		hint: browser.i18n.getMessage('options_general_mode_full_hint'),
		Icon: ModeFull,
	},
	{
		value: PopupMode.Simple,
		label: browser.i18n.getMessage('options_general_mode_simple'),
		hint: browser.i18n.getMessage('options_general_mode_simple_hint'),
		Icon: ModeSimple,
	},
];

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
