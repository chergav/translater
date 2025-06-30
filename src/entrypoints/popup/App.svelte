<main class="flex flex-col items-center gap-4 bg-color-surface">
	<div class="flex w-full items-center justify-between p-2">
		<div class="flex items-center gap-3">
			<img alt="" src="/icons/48.png" width="32" />
			<span class="text-lg">Translater</span>
		</div>
		<div>
			<Button
				icon={mdiCogOutline}
				onclick={openOptionsPage}
				title={browser.i18n.getMessage('popup_menu_options')}
			/>
		</div>
	</div>

	<Button
		icon={mdiApplicationOutline}
		label={browser.i18n.getMessage('commands_open_translater')}
		onclick={openTranslater}
		variant="filled"
	/>

	<div class="w-44">
		<Divider label={browser.i18n.getMessage('popup_or')} />
	</div>

	<div class="flex flex-col items-center gap-2">
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

	<div>
		<RateUs />
	</div>

	<div>
		<Link
			class="text-center text-sm"
			href="https://chergav.github.io/extensions"
			icon
			label={browser.i18n.getMessage('try_my_extensions')}
		/>
	</div>

	<div class="w-full px-2 pb-2">
		<TranslaterVersion />
	</div>

	{#await permissionsPromise then isPermissions}
		{#if !isPermissions}
			<div class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white p-5 dark:bg-gray-900">
				<h1 class="text-lg font-medium">{browser.i18n.getMessage('forefox_perm_header')}</h1>
				<p class="text-center">{browser.i18n.getMessage('forefox_perm_text')}</p>
				<Button
					label={browser.i18n.getMessage('forefox_perm_button')}
					onclick={requestPermissions}
					variant="filled"
				/>
			</div>
		{/if}
	{/await}
</main>

<script lang="ts">
import type { Message } from '~/shared/types';
import { storage } from '@/shared/storage.svelte';
import Button from '~/lib/Button.svelte';
import Shortcuts from '@/lib/Shortcuts.svelte';
import Divider from '~/lib/Divider.svelte';
import Link from '~/lib/Link.svelte';
import TranslaterVersion from '~/lib/TranslaterVersion.svelte';
import RateUs from '~/lib/RateUs.svelte';
import { mdiApplicationOutline, mdiCogOutline } from '@mdi/js';
import { getShortcutByCommand } from '~/shared/browser';

const permissions = { origins: ['<all_urls>'] };
let permissionsPromise = $state<Promise<boolean>>(getPermissions());

function openOptionsPage() {
	browser.runtime.openOptionsPage();
}

function openTranslater() {
	browser.runtime.sendMessage<Message>({
		type: 'openTranslater',
		content: {},
	});
}

let shortcutKeysPromise = getShortcutByCommand('open-translater');

const openExtensionsShortcuts = () => {
	browser.tabs.create({ url: 'chrome://extensions/shortcuts' });
};

function getPermissions() {
	return browser.permissions.contains(permissions);
}

const requestPermissions = async () => {
	const isAllow = await browser.permissions.request(permissions);
	if (isAllow) {
		permissionsPromise = getPermissions();
	}
};

$effect.pre(() => {
	document.documentElement.dataset.theme = storage.themeClass;
	document.documentElement.style.setProperty('color-scheme', storage.themeClass);
	document.documentElement.dataset.variant = storage.settings.themeVariant;
	document.documentElement.dataset.accent = storage.settings.accentColor;
});
</script>
