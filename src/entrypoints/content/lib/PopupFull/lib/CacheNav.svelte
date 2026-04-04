<div class="flex items-center gap-1">
	<Button
		disabled={disabledPrev}
		icon={mdiArrowLeft}
		onclick={cachePrev}
		size="xs"
		title={browser.i18n.getMessage('tooltip_go_back')}
	/>
	<Button
		disabled={disabledNext}
		icon={mdiArrowRight}
		onclick={cacheNext}
		size="xs"
		title={browser.i18n.getMessage('tooltip_go_forward')}
	/>
</div>

<script lang="ts">
import { store } from '~/entrypoints/content/store.svelte';
import Button from '~/lib/Button.svelte';
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js';

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
