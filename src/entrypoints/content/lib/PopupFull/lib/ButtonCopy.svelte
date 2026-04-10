<Button
	disabled={!isClipboardSupport || !text}
	icon={isCopySuccess ? mdiCheckCircleOutline : isCopyFailure ? mdiAlertCircleOutline : mdiContentCopy}
	iconClass={isCopySuccess ? 'text-green-500' : isCopyFailure ? 'text-red-500' : ''}
	onclick={copyToClipboard}
	size="xs"
	{title}
/>

<script lang="ts">
import Button from '~/lib/Button.svelte';
import { mdiContentCopy, mdiCheckCircleOutline, mdiAlertCircleOutline } from '@mdi/js';

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
