{#key update}
	{#await getPermission() then isPerm}
	{#if !isPerm}
		<div class="p-3 flex items-center justify-between">
			<div class="flex items-center">
				<img src={getURL('/src/icons/48.png')} width="24" alt="" />
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
				on:click={requestPermission}
			>{getMessage('forefox_perm_button')}</button>
		</div>

	{:else}
		<div class="p-3 flex items-center justify-between">
			<div class="flex items-center">
				<img src={getURL('/src/icons/48.png')} width="24" alt="" />
				<span class="ml-3">Translater</span>
			</div>
			<div>
				<ButtonImage
					round
					tooltip={{ title: getMessage('popup_menu_options'), placement: 'left' }}
					icon={heroCog8Tooth}
					on:click={openOptionsPage}
				/>
			</div>
		</div>

		<hr class="border-gray-300 dark:border-gray-700" />

		<div class="p-3 min-h-[150px]">
			<SelectLang
				bind:value={$persistentStore.targetLang}
				label={getMessage('target_lang_label')}
				{languages}
			/>
		</div>

		<div class="p-3">
			<a
				href="https://github.com/chergav/translater"
				target="_blank"
				rel="noopener noreferrer"
				class="text-xs text-blue-600 visited:text-purple-600 underline"
			>
				<div class="flex items-center">
					<span>Translater</span>
					<Icon d={heroArrowTopRightOnSquare} class="ml-1" />
				</div>
			</a>
		</div>
	{/if}
	{/await}
{/key}

<script context="module">
import { getMessage, getURL } from '~/common/browserApi';
import { loadFont } from '~/common/fontLoader';
import Icon from '~/lib/Icon.svelte';
import { heroCog8Tooth, heroArrowTopRightOnSquare } from '~/icons/heroicons';

loadFont();
</script>

<script>
import { persistentStore, themeClass } from '~/common/store';
import { languages } from '~/common/settings';
import SelectLang from '~/lib/SelectLang.svelte';
import ButtonImage from '~/lib/ButtonImage.svelte';

let update = false;

const openOptionsPage = () => {
	chrome.runtime.openOptionsPage();
};

$: document.documentElement.className = $themeClass;

const optPerm = { origins: ['<all_urls>'] };

const requestPermission = async () => {
	const allow = await chrome.permissions.request(optPerm);
	if (allow) {
		update = true;
	}
};

const getPermission = async () => await chrome.permissions.contains(optPerm);
</script>
