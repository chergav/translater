<div class="p-2 flex items-center">
	<img src="{runtime.getURL('/src/icons/48.png')}" alt="">
	<span class="ml-4 text-lg">Translater</span>
</div>

<hr class="border-gray-300 dark:border-gray-700">

<div class="p-2">
	<Select bind:value={$persistentStore.targetLang} label={i18n.getMessage('target_lang_label')} {languages} />
</div>
<div class="p-2">
	{#each themes as item (item.key)}
		<div class="mb-1">
			<label>
				<input type="radio" bind:group={$persistentStore.theme} value={item.key} />
				<span>{i18n.getMessage(item.value)}</span>
			</label>
		</div>
	{/each}
</div>
<div class="p-2">
	<label>
		<input type="checkbox" class="rounded-md" bind:checked={$persistentStore.inlineButtonShow}>
		<span>{i18n.getMessage('options_inline_button_show')}</span>
	</label>
</div>

<svelte:head>
	<title>{i18n.getMessage('options_title')}</title>
</svelte:head>

<script context="module">
import { loadFont } from '@/common/fontLoader';

loadFont();
</script>

<script>
import { runtime, i18n } from 'webextension-polyfill';
import { persistentStore, themeClass } from '@/common/store';
import { languages, themes } from '@/common/settings';
import Select from '@/lib/Select.svelte';

$: document.documentElement.className = $themeClass;
</script>
