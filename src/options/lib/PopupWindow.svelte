<div class="p-4">
	<div class="mb-4">
		<Checkbox
			bind:checked={$persistentStore.showOriginalText}
			label={getMessage('options_show_original_text')}
		/>
	</div>
	<div class="mb-4">
		<Checkbox
			bind:checked={$persistentStore.showTransliteration}
			label={getMessage('options_show_transliteration')}
		/>
	</div>
</div>

<script>
import { getMessage } from '~/common/browserApi';
import { persistentStore } from '~/common/store';
import Checkbox from '~/lib/Checkbox.svelte';
</script>
