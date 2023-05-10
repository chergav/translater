<ButtonImage
	disabled={!isClipboardSupport}
	on:click={copyToClipboard}
	on:mouseleave={() => {
		copySuccess = false;
		copyFailure = false;
		title = getMessage('tooltip_copy_to_clipboard');
	}}
	tooltip={{ title }}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="
			w-5
			h-5
			{copySuccess ? 'stroke-green-500' : copyFailure ? 'stroke-red-500' : ''}
		"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
		/>
	</svg>
</ButtonImage>

<script>
import { getMessage } from '~/common/browserApi';
import ButtonImage from '~/lib/ButtonImage.svelte';

export let text;

let copySuccess = false,
	copyFailure = false,
	isClipboardSupport = !!navigator.clipboard;

let title = isClipboardSupport
	? getMessage('tooltip_copy_to_clipboard')
	: getMessage('tooltip_copy_not_support_on_http');

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(text);
		copySuccess = true;
		title = getMessage('tooltip_copyed');
	} catch (error) {
		copyFailure = true;
		title = `<span class="text-red-500">${getMessage('tooltip_copy_error')}</span>`;
		console.log(
			`Can't copy to clipboard. Possibly, you are on unsecure http page.\nError message: ${error}`
		);
	}
};
</script>
