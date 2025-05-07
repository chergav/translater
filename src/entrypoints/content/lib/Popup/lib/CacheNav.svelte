<Button
	disabled={disabledPrev}
	icon={mdiChevronLeft}
	iconSize="20"
	onclick={cachePrev}
	small
	title={browser.i18n.getMessage('tooltip_go_back')}
/>
<Button
	disabled={disabledNext}
	icon={mdiChevronRight}
	iconSize="20"
	onclick={cacheNext}
	small
	title={browser.i18n.getMessage('tooltip_go_forward')}
/>

<script lang="ts">
import { store } from '~/entrypoints/content/store.svelte';
import { storage } from '~/shared/storage.svelte';
import Button from '~/lib/Button.svelte';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';

let disabledPrev = $derived<boolean>(store.cacheIndex <= -store.cacheTranslate.length);
let disabledNext = $derived<boolean>(store.cacheIndex >= -1);

function getCacheItem(index: number) {
	const item = store.cacheTranslate.at(index);

	if (item) {
		store.translated = item;
		store.sourceLang = item.src;
		storage.settings.targetLang = item.targetLang;
	}
}

function cachePrev() {
	getCacheItem(--store.cacheIndex);
}

function cacheNext() {
	getCacheItem(++store.cacheIndex);
}
</script>
