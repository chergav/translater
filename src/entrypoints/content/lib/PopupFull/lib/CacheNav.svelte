<div class="flex items-center gap-1">
	<IconButton
		color="standard"
		disabled={disabledPrev}
		onclick={cachePrev}
		size="xs"
		title={browser.i18n.getMessage('tooltip_go_back')}
	>
		<ArrowBack />
	</IconButton>
	<IconButton
		color="standard"
		disabled={disabledNext}
		onclick={cacheNext}
		size="xs"
		title={browser.i18n.getMessage('tooltip_go_forward')}
	>
		<ArrowForward />
	</IconButton>
</div>

<script lang="ts">
import { store } from '~/entrypoints/content/store.svelte';
import IconButton from '~/lib/base/IconButton.svelte';
import ArrowBack from '~icons/material-symbols/arrow-back-rounded';
import ArrowForward from '~icons/material-symbols/arrow-forward-rounded';

let disabledPrev = $derived<boolean>(store.cacheIndex <= -store.cacheKeys.length);
let disabledNext = $derived<boolean>(store.cacheIndex >= -1);

function cachePrev() {
	if (disabledPrev) return;
	store.setCacheItem(store.cacheIndex - 1);
}

function cacheNext() {
	if (disabledNext) return;
	store.setCacheItem(store.cacheIndex + 1);
}
</script>
