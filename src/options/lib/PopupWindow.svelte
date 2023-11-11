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
</div>

<script>
import { getMessage } from '~/common/browserApi';
import { persistentStore } from '~/common/store';
import Checkbox from '~/lib/Checkbox.svelte';
</script>
