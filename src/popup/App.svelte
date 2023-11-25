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

		<div class="p-3 min-h-[150px]">
			<SelectLang
				label={getMessage('target_lang_label')}
				{languages}
				bind:value={$persistentStore.targetLang}
			/>
		</div>

		<div class="p-3 flex flex-col gap-1">
			<div>
				<a
					class="text-sm text-blue-600 hover:underline"
					href="https://github.com/chergav/translater"
					rel="noopener noreferrer"
					target="_blank"
				>
					Translater
				</a>
			</div>
			<div>
				<a
					class="text-sm text-blue-600 hover:underline"
					href="https://github.com/chergav/translater/releases"
					rel="noopener noreferrer"
					target="_blank"
				>
					{getMessage('app_version')} {version}
				</a>
			</div>
		</div>
	{/if}
{/await}

<script context="module">
import { getMessage, getURL } from '~/common/browserApi';
import { loadFont } from '~/common/fontLoader';
import { heroCog8Tooth } from '~/icons/heroicons';

loadFont();
</script>

<script>
import { persistentStore, themeClass } from '~/common/store';
import { languages } from '~/common/settings';
import SelectLang from '~/lib/SelectLang.svelte';
import ButtonImage from '~/lib/ButtonImage.svelte';

let permPromise;
const optPerm = { origins: ['<all_urls>'] };
const version = chrome.runtime.getManifest().version;

$: document.documentElement.className = $themeClass;

const openOptionsPage = () => {
	chrome.runtime.openOptionsPage();
};

const getPerm = async () => await chrome.permissions.contains(optPerm);

const requestPerm = async () => {
	const isAllow = await chrome.permissions.request(optPerm);
	if (isAllow) {
		permPromise = getPerm();
	}
};

permPromise = getPerm();
</script>
