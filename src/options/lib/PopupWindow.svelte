<div class="pb-4">
	<Checkbox
		bind:checked={$persistentStore.showOriginalText}
		label={getMessage('options_show_original_text')}
	/>
</div>
<div class="pb-4">
	<Checkbox
		bind:checked={$persistentStore.showTransliteration}
		label={getMessage('options_show_transliteration')}
	/>
</div>

<script>
import { getMessage } from '@/common/browserApi';
import { persistentStore } from '@/common/store';
import Checkbox from '@/lib/Checkbox.svelte';
</script>
