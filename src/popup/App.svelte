<div class="p-3 flex items-center">
	<img src={getURL('/src/icons/48.png')} width="24" alt="" />
	<span class="ml-3">Translater</span>
</div>

<hr class="border-gray-300 dark:border-gray-700" />

<div class="p-3 min-h-[150px]">
	<SelectLang
		bind:value={$persistentStore.targetLang}
		label={getMessage('target_lang_label')}
		{languages}
	/>
</div>

<hr class="border-gray-300 dark:border-gray-700" />

<div class="p-3">
	<ButtonFlat
		small
		label={getMessage('popup_menu_options')}
		on:click={openOptionsPage}
	/>
</div>

<script context="module">
import { getMessage, getURL } from '~/common/browserApi';
import { loadFont } from '~/common/fontLoader';

loadFont();
</script>

<script>
import { persistentStore, themeClass } from '~/common/store';
import { languages } from '~/common/settings';
import SelectLang from '~/lib/SelectLang.svelte';
import ButtonFlat from '~/lib/ButtonFlat.svelte';

const openOptionsPage = () => {
	chrome.runtime.openOptionsPage();
};

$: document.documentElement.className = $themeClass;
</script>
