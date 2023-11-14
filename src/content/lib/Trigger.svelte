<div class="flex flex-col">
	<div
		class="
			bg-white
			text-gray-800
			dark:bg-gray-900
			dark:text-gray-200
			border
			border-gray-100
			dark:border-gray-800
			rounded-lg
			shadow-lg
		"
	>
		<button
			class="p-.5"
			type="button"
			on:click={createPopup}
			use:tooltip={{ title: getMessage('tooltip_translate_text') }}
		>
			<Icon d={customTranslate} filled size="lg" stroke="none" />
		</button>
	</div>
</div>

<script>
import { createApp } from '~/content/utils/appsHandler';
import { getSelectedText } from '~/content/utils/rectUtils';
import { store } from '~/content/store';
import { tooltip } from '~/lib/tooltip';
import { getMessage } from '~/common/browserApi';
import Icon from '~/lib/Icon.svelte';
import { customTranslate } from '~/icons/custom';

const createPopup = () => {
	$store.selectedText = getSelectedText();
	if ($store.selectedText) {
		createApp('popup');
	}
};
</script>
