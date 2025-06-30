<div class="scrollbar flex h-full flex-col gap-4 overflow-y-auto p-6">
	<p>{browser.i18n.getMessage('options_support_msg')}:</p>
	<ul class="flex list-inside list-disc flex-col gap-2 marker:text-color-on-surface-variant">
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

	<hr class="my-4 border-color-surface-high">

	<Donations />
</div>

<script lang="ts">
import Link from '~/lib/Link.svelte';
import Donations from './lib/Donations/Donations.svelte';
</script>
