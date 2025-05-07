<Button
	disabled={!text}
	icon={isCopySuccess ? mdiCheckCircleOutline : isCopyFailure ? mdiAlertCircleOutline : mdiContentCopy}
	iconClass={isCopySuccess ? 'text-green-300 dark:text-green-700' : isCopyFailure ? 'text-red-500' : ''}
	label={isCopySuccess ? browser.i18n.getMessage('tooltip_copyed') : browser.i18n.getMessage('options_copy_address')}
	onclick={copyAddress}
	variant="filled"
/>

<script lang="ts">
import Button from '~/lib/Button.svelte';
import {
	mdiContentCopy,
	mdiCheckCircleOutline,
	mdiAlertCircleOutline,
} from '@mdi/js';

interface Props {
	text: string
}

let { text }: Props = $props();
let isCopySuccess = $state<boolean>(false);
let	isCopyFailure = $state<boolean>(false);

function reset() {
	setTimeout(() => {
		isCopySuccess = false;
		isCopyFailure = false;
	}, 1000);
}

async function copyAddress() {
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
