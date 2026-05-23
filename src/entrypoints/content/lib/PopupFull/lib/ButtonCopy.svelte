<IconButton
	color="standard"
	disabled={!isClipboardSupport || !text}
	onclick={copyToClipboard}
	size="xs"
	{title}
>
	<Icon class={isCopySuccess ? 'text-green-500' : isCopyFailure ? 'text-color-error' : ''} />
</IconButton>

<script lang="ts">
import type { Component } from 'svelte';
import IconButton from '~/lib/base/IconButton.svelte';
import ContentCopy from '~icons/material-symbols/content-copy-outline-rounded';
import Check from '~icons/material-symbols/check-circle-outline-rounded';
import Error from '~icons/material-symbols/error-outline-rounded';

interface Props {
	text: string
}

let { text }: Props = $props();

let isCopySuccess = $state<boolean>(false);
let	isCopyFailure = $state<boolean>(false);
let isClipboardSupport = $state<boolean>(!!navigator.clipboard);

let title = $derived(isClipboardSupport
	? browser.i18n.getMessage('tooltip_copy_to_clipboard')
	: browser.i18n.getMessage('tooltip_copy_not_support_on_http'),
);

let Icon = $derived<Component>(isCopySuccess ? Check : isCopyFailure ? Error :  ContentCopy);

function reset() {
	setTimeout(() => {
		isCopySuccess = false;
		isCopyFailure = false;
	}, 1000);
}

async function copyToClipboard() {
	try {
		await navigator.clipboard.writeText(text);
		isCopySuccess = true;
	} catch (error) {
		isCopyFailure = true;
		console.log(`Error: ${error}`);
	} finally {
		reset();
	}
}
</script>
