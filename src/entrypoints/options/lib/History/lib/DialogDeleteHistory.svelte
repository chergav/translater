<Dialog
	quick={storage.motionDisabled}
	bind:open
>
	{#snippet icon()}
		<Delete />
	{/snippet}
	{#snippet headline()}
		{browser.i18n.getMessage('options_clear_history')}?
	{/snippet}

	{#snippet supportingText()}
		{storageHistory.settings.history.length} {browser.i18n.getMessage('options_delete_items')}
	{/snippet}
	{#snippet actions()}
		<Button
			color="text"
			label={browser.i18n.getMessage('button_label_delete')}
			onclick={clearHistory}
		/>
		<Button
			label={browser.i18n.getMessage('button_label_cancel')}
			onclick={() => open = false}
		/>
	{/snippet}
</Dialog>

<script lang="ts">
import { storage } from '~/shared/storage.svelte';
import { storageHistory } from '../storageHistory.svelte';
import Dialog from '~/lib/base/Dialog.svelte';
import Button from '~/lib/base/Button.svelte';
import Delete from '~icons/material-symbols/delete-outline-rounded';

interface Props  {
	open: boolean
}

let {
	open = $bindable(false),
}: Props = $props();

function clearHistory() {
	storageHistory.clear();
	open = false;
}
</script>
