<h1 class="text-xl text-color-on-surface-variant">
	{browser.i18n.getMessage('options_tab_support')}
</h1>

<div class="rounded-2xl bg-color-surface-bright p-4">
	<p class="text-sm">{browser.i18n.getMessage('options_support_msg')}:</p>
	<ul class="flex list-inside list-disc flex-col gap-1 pt-4 marker:text-color-on-surface-variant">
		<li>
			<Link
				class="text-sm"
				href="https://chromewebstore.google.com/detail/abebconmjhhbcjofpchjkbbimgkhdmbe/support"
				label="Chrome Web Store Support"
			>
				{#snippet trailingIcon()}
					<OpenInNew class="size-4.5 shrink-0" />
				{/snippet}
			</Link>
		</li>
		<li>
			<Link
				class="text-sm"
				href="https://github.com/chergav/translater/issues"
				label="Github Issue"
			>
				{#snippet trailingIcon()}
					<OpenInNew class="size-4.5 shrink-0" />
				{/snippet}
			</Link>
		</li>
	</ul>
</div>

<script lang="ts">
import Link from '~/lib/Link.svelte';
import OpenInNew from '~icons/material-symbols/open-in-new-rounded';
</script>
