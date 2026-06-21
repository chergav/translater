<span
	class="relative cursor-default"
	onclickoutside={() => menuOpen = false}
	use:clickOutside
>
	<IconButton
		active={menuOpen}
		color="standard"
		onclick={() => menuOpen = !menuOpen}
		size="xs"
		title="More"
		bind:ref={menuTrigger}
	>
		<More />
	</IconButton>
	<Menu
		align="end"
		triggerRef={menuTrigger}
		bind:open={menuOpen}
	>
		<MenuItem
			disabled={!storageHistory.settings.history.length}
			label={browser.i18n.getMessage('tooltip_copy_to_clipboard')}
			onclick={copyHistory}
		>
			{#snippet leadingIcon()}
				<Copy />
			{/snippet}
		</MenuItem>
		<MenuItem
			disabled={!storageHistory.settings.history.length}
			label={browser.i18n.getMessage('options_history_menu_download')}
			onclick={downloadHistory}
		>
			{#snippet leadingIcon()}
				<Download />
			{/snippet}
		</MenuItem>
		<div class="mx-2 my-1 h-px bg-color-outline-variant"></div>
		<MenuItem
			disabled={!storageHistory.settings.history.length}
			label={browser.i18n.getMessage('options_clear_history')}
			onclick={openDeleteDialog}
		>
			{#snippet leadingIcon()}
				<Delete />
			{/snippet}
		</MenuItem>
	</Menu>
</span>

<!-- div to avoid parent styles -->
<div class="absolute">
	<DialogDeleteHistory bind:open={dialogDeleteHistoryOpen} />
</div>

<script lang="ts">

import { storageHistory } from '../storageHistory.svelte';
import { clickOutside } from '~/utils';
import IconButton from '~/lib/base/IconButton.svelte';
import Snackbar from '~/lib/base/Snackbar.svelte';
import DialogDeleteHistory from './DialogDeleteHistory.svelte';
import { Menu, MenuItem } from '~/lib/base/Menu';
import More from '~icons/material-symbols/more-vert';
import Copy from '~icons/material-symbols/content-copy-outline-rounded';
import Download from '~icons/material-symbols/download-rounded';
import Delete from '~icons/material-symbols/delete-outline-rounded';
import { copyToClipboard } from '~/utils/copyToClipboard';
import { allHistoryItemToString } from '../utils/historyToFormattedText';
import { toast } from 'svelte-sonner';

let dialogDeleteHistoryOpen = $state<boolean>(false);
let menuOpen = $state<boolean>(false);
let menuTrigger = $state<HTMLButtonElement | null>(null);

function openDeleteDialog() {
	dialogDeleteHistoryOpen = true;
}

async function copyHistory() {
	const text = allHistoryItemToString(storageHistory.sortedHistory);

	try {
		await copyToClipboard(text);
		toast.custom(Snackbar, {
			componentProps: {
				supportingText: browser.i18n.getMessage('snackbar_copied'),
				closeButton: true,
			},
		});
	} catch (error) {
		toast.error('Failed to copy to clipboard');
		console.error(`Error: ${error}`);
	}
}

async function grantPermission() {
	const result = await browser.permissions.contains({ permissions: ['downloads'] });

	if (result) return true;

	const granted = browser.permissions.request({ permissions: ['downloads'] });

	return granted;
}

async function download(textContent: string) {
	const blob = new Blob([textContent], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);

	await browser.downloads.download({
		filename: 'history.txt',
		url,
		saveAs: true,
	});

	browser.downloads.onChanged.addListener(delta => {
		if (delta.state?.current === 'complete' || delta.state?.current === 'interrupted') {
			URL.revokeObjectURL(url);
		}
	});
}

async function downloadHistory() {
	const granted = await grantPermission();

	if (granted) {
		const text = allHistoryItemToString(storageHistory.sortedHistory);
		await download(text);
	} else {
		toast.error('Permission required to download');
	}
}
</script>
