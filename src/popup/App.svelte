{#await permPromise then isPerm}
	{#if !isPerm}
		<div class="p-3 flex items-center justify-between">
			<div class="flex items-center">
				<img alt="" src={getURL('/src/icons/48.png')} width="24" />
				<span class="ml-3">Translater</span>
			</div>
		</div>

		<hr class="border-gray-300 dark:border-gray-700" />

		<div class="p-5 flex flex-col">
			<h1 class="py-2 text-lg font-medium">{getMessage('forefox_perm_header')}</h1>
			<p class="py-2">{getMessage('forefox_perm_text')}</p>
			<button
				class="
					px-1
					py-2
					w-full
					rounded-lg
					text-gray-900
					dark:text-gray-200
					bg-sky-200
					dark:bg-sky-900
				"
				type="button"
				on:click={requestPerm}>{getMessage('forefox_perm_button')}</button
			>
		</div>
	{:else}
		<div class="p-3 flex items-center justify-between">
			<div class="flex items-center">
				<img alt="" src={getURL('/src/icons/48.png')} width="32" />
				<span class="ml-3 text-lg">Translater</span>
			</div>
			<div>
				<ButtonImage
					icon={heroCog8Tooth}
					round
					tooltip={{ title: getMessage('popup_menu_options'), placement: 'left' }}
					on:click={openOptionsPage}
				/>
			</div>
		</div>

		<hr class="border-gray-300 dark:border-gray-700" />

		<div class="p-3 flex flex-col gap-3 min-h-[200px]">
			<div>
				<ButtonImage
					icon={heroWindow}
					label={getMessage('commands_open_translater')}
					on:click={openTranslater}
			/>
			</div>
			<p class="text-sm">
				{getMessage('popup_or_press_keyboard_shortcut')}
			</p>
			{#await shortcutKeysPromise then shortcutKeys}
				<KBD keys={shortcutKeys} />
			{/await}
			{#if isChrome()}
				<p>
					<button
						class="text-sm text-blue-600 hover:underline"
						type="button"
						on:click={openExtensionsShortcuts}
					>
						{getMessage('options_edit_keyboard_shortcut')}
					</button>
				</p>
			{/if}
		</div>

		<TranslaterVersion />
	{/if}
{/await}

<script context="module">
import { loadFont } from '~/common/fontLoader';

loadFont();
</script>

<script>
import {
	getMessage,
	getURL,
	openOptionsPage,
	isChrome,
	getShortcutByCommand,
	tabCreate,
	sendMessage
} from '~/common/browserApi';
import { themeClass } from '~/common/store';
import { heroCog8Tooth, heroWindow } from '~/icons/heroicons';
import ButtonImage from '~/lib/ButtonImage.svelte';
import TranslaterVersion from '~/lib/TranslaterVersion.svelte';
import KBD from '~/lib/KBD.svelte';

let shortcutKeysPromise = getShortcutByCommand('open-translater');
const optPerm = { origins: ['<all_urls>'] };

$: document.documentElement.className = $themeClass;

const getPerm = async () => await chrome.permissions.contains(optPerm);

const requestPerm = async () => {
	const isAllow = await chrome.permissions.request(optPerm);
	if (isAllow) {
		permPromise = getPerm();
	}
};

let permPromise = getPerm();

const openExtensionsShortcuts = () => {
	tabCreate({ url: 'chrome://extensions/shortcuts' });
};

const openTranslater = () => {
	sendMessage({ type: 'openTranslater' });
};
</script>
