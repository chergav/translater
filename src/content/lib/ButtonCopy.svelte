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
	<Icon
		d={heroClipboard}
		class="{copySuccess ? 'stroke-green-500' : copyFailure ? 'stroke-red-500' : ''}"
	/>
</ButtonImage>

<script>
import { getMessage } from '~/common/browserApi';
import ButtonImage from '~/lib/ButtonImage.svelte';
import Icon from '~/lib/Icon.svelte';
import { heroClipboard } from '@icons/heroicons';

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
