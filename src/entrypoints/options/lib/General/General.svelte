<div class="scrollbar flex size-full flex-col gap-4 overflow-y-auto *:mx-auto *:w-full *:max-w-4xl">
	<h1 class="text-xl text-color-on-surface-variant">
		{browser.i18n.getMessage('options_tab_general')}
	</h1>

	<h2 class="text-sm font-medium text-color-on-surface-variant">
		{browser.i18n.getMessage('options_select_langs_title')}
	</h2>

	<SegmentedList>
		<SelectLanguageSimple
			autoLang
			icon={mdiArrowRightCircleOutline}
			label={browser.i18n.getMessage('select_lang_source')}
			small
			bind:value={storage.settings.sourceLang}
		/>

		<SelectLanguageSimple
			icon={mdiArrowLeftCircleOutline}
			label={browser.i18n.getMessage('select_lang_target')}
			small
			bind:value={storage.settings.targetLang}
		/>
	</SegmentedList>

	<h2 class="mt-2 text-sm font-medium text-color-on-surface-variant">
		{browser.i18n.getMessage('options_general_translation_button')}
	</h2>

	<SegmentedList>
		<Switch
			hint={browser.i18n.getMessage('options_inline_button_show_hint')}
			icon={mdiText}
			label={browser.i18n.getMessage('options_inline_button_show')}
			bind:checked={storage.settings.inlineButtonShow}
		/>
		<Switch
			hint={browser.i18n.getMessage('options_text_field_button_show_hint')}
			icon={mdiFormTextbox}
			label={browser.i18n.getMessage('options_text_field_button_show')}
			bind:checked={storage.settings.textFieldButtonShow}
		/>
		<Switch
			disabled={!storage.settings.inlineButtonShow && !storage.settings.textFieldButtonShow}
			hint="{browser.i18n.getMessage('options_hide_translation_button_hint')}: {userLanguage}."
			icon={mdiTranslateOff}
			label={browser.i18n.getMessage('options_hide_translation_button')}
			bind:checked={storage.settings.hideButtonForUserLanguage}
		/>
	</SegmentedList>

	<SegmentedList>
		<div class="flex items-center gap-3 p-3">
			<span class="text-color-on-surface-variant">
				<Icon d={mdiWebOff} size="20" />
			</span>
			<div class="inline-flex flex-wrap items-center gap-2">
				<p>{browser.i18n.getMessage('options_hide_button_on_sites')}:</p>
				{#each storage.settings.blacklistDomainForInline as domain, index (index)}
					<Chip class="bg-color-surface" content={domain}>
						{#snippet end()}
							<Button
								class="size-6"
								icon={mdiClose}
								iconSize="16"
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
		</div>
	</SegmentedList>

	<h2 class="mt-2 text-sm font-medium text-color-on-surface-variant">
		{browser.i18n.getMessage('options_tab_popup_window')}
	</h2>

	<SegmentedList expressive>
		{#each modes as { value, label, hint, icon } (value)}
			<Radio
				{hint}
				{icon}
				{label}
				mode="list"
				{value}
				bind:group={storage.settings.popupMode}
			/>
		{/each}
	</SegmentedList>

	<SegmentedList>
		<Switch
			hint={browser.i18n.getMessage('options_general_show_on_selected_hint')}
			icon={mdiMessageTextFastOutline}
			label={browser.i18n.getMessage('options_general_show_on_selected')}
			bind:checked={storage.settings.showPopupOnSelection}
		/>
		<Switch
			hint={browser.i18n.getMessage('options_lock_popup_window_hint')}
			icon={mdiLockOutline}
			label={browser.i18n.getMessage('options_lock_popup_window')}
			bind:checked={storage.settings.lockWindow}
		/>
		<Switch
			hint={browser.i18n.getMessage('options_show_langs_simple_hint')}
			icon={mdiTranslateVariant}
			label={browser.i18n.getMessage('options_show_langs_simple')}
			bind:checked={storage.settings.simpleModeShowLangs}
		/>
		<Switch
			hint={browser.i18n.getMessage('options_show_original_text_hint')}
			icon={mdiTextBoxCheckOutline}
			label={browser.i18n.getMessage('options_show_original_text')}
			bind:checked={storage.settings.showOriginalText}
		/>
		<Switch
			hint={browser.i18n.getMessage('options_show_transliteration_hint')}
			icon={mdiAlphabetLatin}
			label={browser.i18n.getMessage('options_show_transliteration')}
			bind:checked={storage.settings.showTransliteration}
		/>
	</SegmentedList>

	<SegmentedList>
		<Select
			icon={mdiFormatSize}
			label={browser.i18n.getMessage('options_font_size')}
			small
			bind:value={storage.settings.fontSize}
		>
			{#each fontSizes as { value, label } (value)}
				<option {value}>{label}</option>
			{/each}
		</Select>
		<div class="flex items-center gap-3 p-3">
			<span class="text-color-on-surface-variant">
				<Icon d={mdiKeyboardOutline} size="20" />
			</span>
			<div class="flex w-full items-center justify-between">
				<p>{browser.i18n.getMessage('options_keyboard_shortcut_open_popup')}:</p>
				{#await shortcutKeysPromise then shortcutKeys}
					<Shortcuts keys={shortcutKeys} />
				{/await}
			</div>
			{#if import.meta.env.CHROME}
				<div>
					<Button
						icon={mdiPencilOutline}
						onclick={openExtensionsShortcuts}
						size="xs"
						title={browser.i18n.getMessage('options_edit_keyboard_shortcut')}
					/>
				</div>
			{/if}
		</div>
	</SegmentedList>

	<!-- <OAuth /> -->
</div>

<script lang="ts">
import { FontSize, PopupMode } from '~/types';
import { storage } from '~/shared/storage.svelte';
import SelectLanguageSimple from '~/lib/SelectLanguageSimple.svelte';
import Button from '~/lib/Button.svelte';
import Select from '~/lib/Select.svelte';
import Switch from '~/lib/Switch.svelte';
import Radio from '~/lib/Radio.svelte';
import SegmentedList from '~/lib/SegmentedList.svelte';
import Chip from '~/lib/Chip.svelte';
import Shortcuts from '~/lib/Shortcuts.svelte';
import Icon from '~/lib/Icon.svelte';
import { getShortcutByCommand } from '~/shared/browser';
import { getUILanguageCode, getDisplayedLanguageName } from '~/shared/languages';
import {
	mdiClose,
	mdiPencilOutline,
	mdiText,
	mdiFormTextbox,
	mdiTranslateOff,
	mdiWebOff,
	mdiArrowRightCircleOutline,
	mdiArrowLeftCircleOutline,
	mdiMessageTextFastOutline,
	mdiLockOutline,
	mdiTranslateVariant,
	mdiTextBoxCheckOutline,
	mdiAlphabetLatin,
	mdiFormatSize,
	mdiKeyboardOutline,
	mdiArrowExpand,
	mdiArrowCollapse,
} from '@mdi/js';
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
	const userUILanguageCode = getUILanguageCode();
	return getDisplayedLanguageName(userUILanguageCode, 'name+code');
}

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

const fontSizes: {
	value: FontSize,
	label: string
}[] = [
	{
		value: FontSize.ExtraSmall,
		label: browser.i18n.getMessage('options_font_size_xs').toLowerCase(),
	},
	{
		value: FontSize.Small,
		label: browser.i18n.getMessage('options_font_size_sm').toLowerCase(),
	},
	{
		value: FontSize.Normal,
		label: browser.i18n.getMessage('options_font_size_md').toLowerCase(),
	},
	{
		value: FontSize.Large,
		label: browser.i18n.getMessage('options_font_size_lg').toLowerCase(),
	},
	{
		value: FontSize.ExtraLarge,
		label: browser.i18n.getMessage('options_font_size_xl').toLowerCase(),
	},
];
</script>
