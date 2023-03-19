<div class="flex justify-center">
	<div class="w-[440px] select-none">
		<div class="py-5 flex items-center">
			<img src={getURL('/src/icons/48.png')} alt="" />
			<span class="ml-4 text-xl">Translater</span>
		</div>

		<div class="py-4 border-t border-gray-300 dark:border-gray-700">
			<Select
				bind:value={$persistentStore.targetLang}
				label={getMessage('target_lang_label')}
				{languages}
			/>
		</div>

		<div class="py-2 border-t border-gray-300 dark:border-gray-700">
			<h2 class="text-lg mb-2">{getMessage('options_header_inline_translate')}</h2>

			<div class="py-2">
				<label class="flex items-center cursor-pointer">
					<input
						type="checkbox"
						class="rounded-md mr-3"
						bind:checked={$persistentStore.inlineButtonShow}
					/>
					<span>{getMessage('options_inline_button_show')}</span>
				</label>
			</div>
			<div class="py-2">
				<label class="flex items-center cursor-pointer">
					<input
						type="checkbox"
						class="rounded-md mr-3"
						bind:checked={$persistentStore.textFieldButtonShow}
					/>
					<span>{getMessage('options_text_field_button_show')}</span>
				</label>
			</div>
		</div>

		<div class="py-2 border-t border-gray-300 dark:border-gray-700">
			<h2 class="text-lg mb-2">{getMessage('options_header_popup_window')}</h2>

			<div class="py-2">
				<label class="flex items-center cursor-pointer">
					<input
						type="checkbox"
						class="rounded-md mr-3"
						bind:checked={$persistentStore.showOriginalText}
					/>
					<span>{getMessage('options_show_original_text')}</span>
				</label>
			</div>
			<div class="py-2">
				<label class="flex items-center cursor-pointer">
					<input
						type="checkbox"
						class="rounded-md mr-3"
						bind:checked={$persistentStore.showTransliteration}
					/>
					<span>{getMessage('options_show_transliteration')}</span>
				</label>
			</div>
		</div>

		<div class="py-2 border-t border-gray-300 dark:border-gray-700">
			<h2 class="text-lg mb-2">{getMessage('options_header_appearance')}</h2>

			<div class="py-2">
				{#each themes as item (item.key)}
					<div class="mb-3">
						<label class="flex items-center cursor-pointer">
							<input
								type="radio"
								bind:group={$persistentStore.theme}
								value={item.key}
								class="mr-3"
							/>
							<span>{getMessage(item.value)}</span>
						</label>
					</div>
				{/each}
			</div>
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
