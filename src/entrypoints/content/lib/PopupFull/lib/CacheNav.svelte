<Button
	disabled={disabledPrev}
	icon={mdiChevronLeft}
	onclick={cachePrev}
	size="xs"
	title={browser.i18n.getMessage('tooltip_go_back')}
/>
<Button
	disabled={disabledNext}
	icon={mdiChevronRight}
	onclick={cacheNext}
	size="xs"
	title={browser.i18n.getMessage('tooltip_go_forward')}
/>

<script lang="ts">
import { store } from '~/entrypoints/content/store.svelte';
import { storage } from '~/shared/storage.svelte';
import Button from '~/lib/Button.svelte';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';

let disabledPrev = $derived<boolean>(store.cacheIndex <= -store.cache.length);
let disabledNext = $derived<boolean>(store.cacheIndex >= -1);

function getCacheItem(index: number) {
	const item = store.cache.at(index);

	if (!item) return;

	store.translated = item;
	if (store.translationAi) store.translationAi.text = item.sentence.trans || '';
	store.sourceLang = item.src;
	storage.settings.targetLang = item.targetLang;
}

function cachePrev() {
	if (disabledPrev) return;

	getCacheItem(--store.cacheIndex);
}

function cacheNext() {
	if (disabledNext) return;

	getCacheItem(++store.cacheIndex);
}
</script>
