<div class="max-w-md">
	<div class="p-3 flex items-center">
		<img src="{getURL('/src/icons/48.png')}" alt="">
		<span class="ml-4 text-lg">Translater</span>
	</div>

	<hr class="h-px my-3 border-0 bg-gray-300 dark:bg-gray-700" />

	<div class="p-3">
		<Select bind:value={$persistentStore.targetLang} label={getMessage('target_lang_label')} {languages} />
	</div>

	<hr class="h-px my-3 border-0 bg-gray-300 dark:bg-gray-700" />

	<div class="p-3">
		<label>
			<input type="checkbox" class="rounded-md" bind:checked={$persistentStore.inlineButtonShow}>
			<span>{getMessage('options_inline_button_show')}</span>
		</label>
	</div>

	<div class="p-3">
		<label>
			<input type="checkbox" class="rounded-md" bind:checked={$persistentStore.textFieldButtonShow}>
			<span>{getMessage('options_text_field_button_show')}</span>
		</label>
	</div>

	<hr class="h-px my-3 border-0 bg-gray-300 dark:bg-gray-700" />

	<div class="p-3">
		<label>
			<input type="checkbox" class="rounded-md" bind:checked={$persistentStore.showOriginalText}>
			<span>{getMessage('options_show_original_text')}</span>
		</label>
	</div>

	<hr class="h-px my-3 border-0 bg-gray-300 dark:bg-gray-700" />

	<div class="p-3">
		{#each themes as item (item.key)}
			<div class="mb-2">
				<label>
					<input type="radio" bind:group={$persistentStore.theme} value={item.key} />
					<span>{getMessage(item.value)}</span>
				</label>
			</div>
		{/each}
	</div>
</div>

<svelte:head>
	<title>{getMessage('options_title')}</title>
</svelte:head>

<script context="module">
import { loadFont } from '@/common/fontLoader';

loadFont();
</script>

<script>
import { getMessage, getURL } from '@/common/browserApi';
import { persistentStore, themeClass } from '@/common/store';
import { languages, themes } from '@/common/settings';
import Select from '@/lib/Select.svelte';

$: document.documentElement.className = $themeClass;
</script>
