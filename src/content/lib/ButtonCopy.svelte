<button
	type="button"
	class="
		text-gray-500
		hover:text-gray-900
		hover:bg-gray-200
		rounded-md
		text-sm
		p-1
		inline-flex
		items-center
		dark:hover:bg-gray-700
		dark:text-gray-400
		dark:hover:text-white
		disabled:opacity-50
		transition
		[&>*]:pointer-events-none
	"
	disabled={!isClipboardSupport}
	on:click={copyToClipboard}
	on:mouseleave={() => {
		copySuccess = false;
		copyFailure = false;
	}}
	use:tooltip={{ title }}
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
			d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
		/>
	</svg>
</button>

<script>
import { tooltip } from '@/lib/tooltip';
import { getMessage } from '@/common/browserApi';

export let textToCopy;

let copySuccess = false,
	copyFailure = false,
	isClipboardSupport = !!navigator.clipboard;

let title = isClipboardSupport
	? getMessage('tooltip_copy_to_clipboard')
	: getMessage('tooltip_copy_not_support_on_http');

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(textToCopy);
		copySuccess = true;
		title = '';
		title = getMessage('tooltip_copyed');
	} catch (error) {
		copyFailure = true;
		title = '';
		title = `<span class="text-red-500">${getMessage('tooltip_copy_error')}</span>`;
		console.log(
			`Can't copy to clipboard. Possibly, you are on unsecure http page.\nError message: ${error}`
		);
	}
};
</script>
