<div class="p-3 flex items-center">
	<img src={getURL('/src/icons/24.png')} width="24" alt="" />
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
	<button
		type="button"
		class="
			rounded-md
			text-base
			px-2
			py-1.5
			mr-2
			bg-transparent
			hover:bg-gray-200
			dark:hover:bg-gray-700
			text-gray-500
			dark:text-gray-400
			transition-colors
		"
		on:click={openOptionsPage}
	>
		{getMessage('popup_menu_options')}
	</button>
</div>

<script context="module">
import { getMessage, getURL } from '@/common/browserApi';
import { loadFont } from '@/common/fontLoader';

loadFont();
</script>

<script>
import { persistentStore, themeClass } from '@/common/store';
import { languages } from '@/common/settings';
import SelectLang from '@/lib/SelectLang.svelte';

const openOptionsPage = () => {
	chrome.runtime.openOptionsPage();
};

$: document.documentElement.className = $themeClass;
</script>
