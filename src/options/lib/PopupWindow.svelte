<div class="p-6 flex flex-col gap-4">
	<Checkbox
		bind:checked={$persistentStore.lockWindow}
		label={getMessage('options_lock_popup_window')}
		hint={getMessage('options_lock_popup_window_hint')}
	/>
	<Checkbox
		bind:checked={$persistentStore.showOriginalText}
		label={getMessage('options_show_original_text')}
	/>
	<Checkbox
		bind:checked={$persistentStore.showTransliteration}
		label={getMessage('options_show_transliteration')}
	/>
</div>

<script>
import { getMessage } from '~/common/browserApi';
import { persistentStore } from '~/common/store';
import Checkbox from '~/lib/Checkbox.svelte';
</script>
