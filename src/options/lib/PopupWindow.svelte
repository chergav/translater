<div class="p-6 flex flex-col gap-4">
	<Checkbox
		hint={getMessage('options_lock_popup_window_hint')}
		label={getMessage('options_lock_popup_window')}
		bind:checked={$persistentStore.lockWindow}
	/>
	<Checkbox
		label={getMessage('options_show_original_text')}
		bind:checked={$persistentStore.showOriginalText}
	/>
	<Checkbox
		label={getMessage('options_show_transliteration')}
		bind:checked={$persistentStore.showTransliteration}
	/>
	<div class="py-2 flex flex-col gap-3 border-t border-gray-300 dark:border-gray-700">
		<p>{getMessage('options_keyboard_shortcut_open_popup')}</p>
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
</div>

<script>
import { getMessage, isChrome, getShortcutByCommand, tabCreate } from '~/common/browserApi';
import { persistentStore } from '~/common/store';
import Checkbox from '~/lib/Checkbox.svelte';
import KBD from '~/lib/KBD.svelte';

let shortcutKeysPromise = getShortcutByCommand('open-translater');

const openExtensionsShortcuts = () => {
	tabCreate({ url: 'chrome://extensions/shortcuts' });
};
</script>
