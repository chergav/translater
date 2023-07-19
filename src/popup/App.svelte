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

<!-- <hr class="border-gray-300 dark:border-gray-700" /> -->

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

const openOptionsPage = () => {
	chrome.runtime.openOptionsPage();
};

$: document.documentElement.className = $themeClass;
</script>
