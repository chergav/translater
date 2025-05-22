<div class="p-6 h-full flex flex-col gap-4 overflow-y-auto scrollbar">
	<p>{browser.i18n.getMessage('options_support_msg')}:</p>
	<ul class="flex flex-col gap-2 list-disc list-inside marker:text-neutral-500">
		<li>
			<Link
				href="https://chromewebstore.google.com/detail/abebconmjhhbcjofpchjkbbimgkhdmbe/support"
				icon
				label="Chrome Web Store Support"
			/>
		</li>
		<li>
			<Link
				href="https://github.com/chergav/translater/issues"
				icon
				label="Github Issue"
			/>
		</li>
	</ul>

	<hr class="my-4 border-variant-300-700">

	<Donations />
</div>

<script lang="ts">
import Link from '~/lib/Link.svelte';
import Donations from './lib/Donations/Donations.svelte';
</script>
