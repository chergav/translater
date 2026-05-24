<main class="flex flex-col items-center gap-6 bg-color-surface-container">
	<div class="flex w-full items-center justify-between p-2">
		<div class="flex items-center gap-3">
			<img alt="" src="/icons/48.png" width="32" />
			<span class="text-lg">Translator</span>
		</div>
		<div>
			<IconButton
				color="standard"
				onclick={openOptionsPage}
				title={browser.i18n.getMessage('popup_menu_options')}
			>
				<Settings />
			</IconButton>
		</div>
	</div>

	{#await isContentScriptExistPromise then isContentScriptExist}
		{#if isContentScriptExist}
			<div class="flex flex-col items-center gap-2">
				<Button
					color="filled"
					label={browser.i18n.getMessage('commands_open_translator')}
					onclick={openTranslator}
				>
					{#snippet leadingIcon()}
						<WebAsset />
					{/snippet}
				</Button>

				<div class="w-44">
					<Divider label={browser.i18n.getMessage('popup_or')} />
				</div>

				<div class="flex items-center gap-2">
					{#await shortcutKeysPromise then shortcutKeys}
						<Shortcuts keys={shortcutKeys} />
					{/await}
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
			</div>
		{/if}
	{/await}

	<div>
		<RateUs />
	</div>

	<div class="flex flex-col items-center gap-2">
		<div>
			<Link
				class="text-center text-sm"
				href="https://chergav.github.io/extensions"
				label={browser.i18n.getMessage('try_my_extensions')}
			>
				{#snippet trailingIcon()}
					<OpenInNew class="size-4.5 shrink-0" />
				{/snippet}
			</Link>
		</div>

		<div class="flex w-full items-center justify-center gap-2 px-2 pb-2">
			<TranslatorVersion />
			<Link
				class="text-sm"
				href="https://chergav.github.io/extensions/translater/onboarding/"
				label="Onboarding"
			/>
		</div>
	</div>

	{#await permissionsPromise then isPermissions}
		{#if !isPermissions}
			<div class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white p-5 dark:bg-gray-900">
				<h1 class="text-lg font-medium">{browser.i18n.getMessage('forefox_perm_header')}</h1>
				<p class="text-center">{browser.i18n.getMessage('forefox_perm_text')}</p>
				<Button
					color="filled"
					label={browser.i18n.getMessage('forefox_perm_button')}
					onclick={requestPermissions}
				/>
			</div>
		{/if}
	{/await}
</main>

<script lang="ts">
import type { Message } from '~/types';
import { storage } from '~/shared/storage.svelte';
import IconButton from '~/lib/base/IconButton.svelte';
import Button from '~/lib/base/Button.svelte';
import Shortcuts from '~/lib/Shortcuts.svelte';
import Divider from '~/lib/Divider.svelte';
import Link from '~/lib/Link.svelte';
import TranslatorVersion from '~/lib/TranslatorVersion.svelte';
import RateUs from '~/lib/RateUs.svelte';
import OpenInNew from '~icons/material-symbols/open-in-new-rounded';
import Settings from '~icons/material-symbols/settings-outline-rounded';
import WebAsset from '~icons/material-symbols/web-asset';
import Edit from '~icons/material-symbols/edit-outline-rounded';
import { getShortcutByCommand } from '~/shared/browser';
import { applyThemeString } from '~/utils/theme';

const permissions = { origins: ['<all_urls>'] };
let permissionsPromise = $state<Promise<boolean>>(getPermissions());
let isContentScriptExistPromise = $state<Promise<boolean>>(ensureContentScriptInActiveTab());

function openOptionsPage() {
	browser.runtime.openOptionsPage();
}

function openTranslator() {
	browser.runtime.sendMessage<Message>({ type: 'openTranslator' });
}

let shortcutKeysPromise = getShortcutByCommand('open-translator');

function openExtensionsShortcuts() {
	browser.tabs.create({ url: 'chrome://extensions/shortcuts' });
}

async function getPermissions() {
	return await browser.permissions.contains(permissions);
}

async function requestPermissions() {
	const isAllow = await browser.permissions.request(permissions);
	if (isAllow) {
		permissionsPromise = getPermissions();
	}
}

async function ensureContentScriptInActiveTab() {
	return await browser.runtime.sendMessage<Message>({ type: 'pingContentScript' });
}

$effect.pre(() => {
	const root = document.documentElement;

	root.style.setProperty('color-scheme', storage.themeClass);
	root.dataset.contrast = storage.contrast;
	root.dataset.theme = storage.themeClass;
	root.dataset.themeColor = storage.settings.accentColor;
	root.classList.toggle('reduced-motion', storage.motionDisabled);

	if (storage.settings.customTheme) {
		applyThemeString(document, storage.settings.customTheme);
	}
});
</script>
