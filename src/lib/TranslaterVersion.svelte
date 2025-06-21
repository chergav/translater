<div class="flex gap-2 whitespace-nowrap">
	<div>
		<Link
			class="text-sm"
			href="https://github.com/chergav/translater"
			label="Translater v{version}"
		/>
	</div>
	<div>
		<Link
			class="text-sm"
			href="https://github.com/chergav/translater/releases"
			label="Changelog"
		/>
	</div>
</div>

<script lang="ts">
import Link from '~/lib/Link.svelte';
const version = browser.runtime.getManifest().version;
</script>
