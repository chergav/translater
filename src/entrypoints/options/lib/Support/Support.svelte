<div class="scrollbar flex h-full flex-col gap-4 overflow-y-auto *:mx-auto *:w-full *:max-w-4xl">
	<h1 class="text-xl text-color-on-surface-variant">
		{browser.i18n.getMessage('options_tab_support')}
	</h1>

	<p class="text-sm">{browser.i18n.getMessage('options_support_msg')}:</p>
	<ul class="flex list-inside list-disc flex-col gap-1 marker:text-color-on-surface-variant">
		<li>
			<Link
				class="text-sm"
				href="https://chromewebstore.google.com/detail/abebconmjhhbcjofpchjkbbimgkhdmbe/support"
				icon
				iconSize="16"
				label="Chrome Web Store Support"
			/>
		</li>
		<li>
			<Link
				class="text-sm"
				href="https://github.com/chergav/translater/issues"
				icon
				iconSize="16"
				label="Github Issue"
			/>
		</li>
	</ul>
</div>

<script lang="ts">
import Link from '~/lib/Link.svelte';
</script>
