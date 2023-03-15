<div class="flex justify-center">
	<div>
		<div class="my-2 flex items-center">
			<img src={getURL('/src/icons/48.png')} alt="" />
			<span class="ml-4 text-xl">Translater</span>
		</div>

		<hr class="h-px my-3 border-0 bg-gray-300 dark:bg-gray-700" />

		<div class="my-2">
			<Select
				bind:value={$persistentStore.targetLang}
				label={getMessage('target_lang_label')}
				{languages}
			/>
		</div>

		<hr class="h-px my-3 border-0 bg-gray-300 dark:bg-gray-700" />

		<h2 class="text-lg">{getMessage('options_header_inline_translate')}</h2>

		<div class="my-2">
			<label>
				<input
					type="checkbox"
					class="rounded-md"
					bind:checked={$persistentStore.inlineButtonShow}
				/>
				<span>{getMessage('options_inline_button_show')}</span>
			</label>
		</div>
		<div class="my-2">
			<label>
				<input
					type="checkbox"
					class="rounded-md"
					bind:checked={$persistentStore.textFieldButtonShow}
				/>
				<span>{getMessage('options_text_field_button_show')}</span>
			</label>
		</div>

		<hr class="h-px my-3 border-0 bg-gray-300 dark:bg-gray-700" />

		<h2 class="text-lg">{getMessage('options_header_popup_window')}</h2>

		<div class="my-2">
			<label>
				<input
					type="checkbox"
					class="rounded-md"
					bind:checked={$persistentStore.showOriginalText}
				/>
				<span>{getMessage('options_show_original_text')}</span>
			</label>
		</div>
		<div class="my-2">
			<label>
				<input
					type="checkbox"
					class="rounded-md"
					bind:checked={$persistentStore.showTransliteration}
				/>
				<span>{getMessage('options_show_transliteration')}</span>
			</label>
		</div>

		<hr class="h-px my-3 border-0 bg-gray-300 dark:bg-gray-700" />

		<h2 class="text-lg">{getMessage('options_header_appearance')}</h2>

		<div class="my-2">
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
