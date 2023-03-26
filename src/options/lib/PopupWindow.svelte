<div class="pb-4">
	<label class="flex items-center cursor-pointer">
		<input
			type="checkbox"
			class="rounded mr-3"
			bind:checked={$persistentStore.showOriginalText}
		/>
		<span>{getMessage('options_show_original_text')}</span>
	</label>
</div>
<div class="pb-4">
	<label class="flex items-center cursor-pointer">
		<input
			type="checkbox"
			class="rounded mr-3"
			bind:checked={$persistentStore.showTransliteration}
		/>
		<span>{getMessage('options_show_transliteration')}</span>
	</label>
</div>

<script>
import { getMessage } from '@/common/browserApi';
import { persistentStore } from '@/common/store';
</script>
