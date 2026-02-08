<div class="scrollbar flex h-full flex-col gap-4 overflow-y-auto p-6">
	<SelectLanguageSimple
		label={browser.i18n.getMessage('target_lang_label')}
		bind:value={storage.settings.targetLang}
	/>
	<SwitchGroup>
		<Switch
			class="justify-between"
			label={browser.i18n.getMessage('options_inline_button_show')}
			bind:checked={storage.settings.inlineButtonShow}
		/>
		<Switch
			class="justify-between"
			label={browser.i18n.getMessage('options_text_field_button_show')}
			bind:checked={storage.settings.textFieldButtonShow}
		/>
		<Switch
			class="justify-between"
			disabled={!storage.settings.inlineButtonShow && !storage.settings.textFieldButtonShow}
			hint="If enabled, the translate button will not appear when selecting text in your language: {userLanguage}."
			label="Hide the translation button for your language"
			bind:checked={storage.settings.hideButtonForUserLanguage}
		/>
	</SwitchGroup>
	<div>
		<p class="mb-2 text-sm">{browser.i18n.getMessage('options_hide_button_on_sites')}</p>
		<div>
			{#each storage.settings.blacklistDomainForInline as domain, index (index)}
				<span class="mr-2 mb-2 inline-flex items-center gap-1 rounded-lg bg-color-surface-high px-1.5 py-0.5">
					{domain}
					<button
						class="text-color-error"
						onclick={() => {
							deleteFromBlacklist(domain);
						}}
						title="Delete"
						type="button"
					>
						<Icon d={mdiTrashCanOutline} size="20" />
					</button>
				</span>
			{:else}
				<span class="text-sm text-color-on-surface-variant">
					{browser.i18n.getMessage('options_hide_button_on_sites_empty_list')}
				</span>
			{/each}
		</div>
	</div>

	<div class="pt-2 text-lg">Popup window</div>

	<SwitchGroup>
		<Switch
			hint={browser.i18n.getMessage('options_lock_popup_window_hint')}
			label={browser.i18n.getMessage('options_lock_popup_window')}
			bind:checked={storage.settings.lockWindow}
		/>
		<Switch
			label={browser.i18n.getMessage('options_show_original_text')}
			bind:checked={storage.settings.showOriginalText}
		/>
		<Switch
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
		<p class="text-sm">{browser.i18n.getMessage('options_keyboard_shortcut_open_popup')}:</p>
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

	<!-- <OAuth /> -->

</div>

<script lang="ts">
import { FontSize } from '~/types';
import { storage } from '~/shared/storage.svelte';
import SelectLanguageSimple from '~/lib/SelectLanguageSimple.svelte';
import Icon from '~/lib/Icon.svelte';
import Select from '~/lib/Select.svelte';
import Switch from '~/lib/Switch.svelte';
import SwitchGroup from '~/lib/SwitchGroup.svelte';
import Shortcuts from '~/lib/Shortcuts.svelte';
import { getShortcutByCommand } from '~/shared/browser';
import { mdiTrashCanOutline } from '@mdi/js';
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
