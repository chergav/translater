<div class="flex gap-1">
	<ButtonImage
		disabled={disabledPrev}
		icon={heroChevronLeft}
		round
		tooltip={{ title: getMessage('tooltip_go_back') }}
		on:click={cachePrev}
	/>
	<ButtonImage
		disabled={disabledNext}
		icon={heroChevronRight}
		round
		tooltip={{ title: getMessage('tooltip_go_forward') }}
		on:click={cacheNext}
	/>
</div>
<div class="flex gap-1">
	<PopupMenu />

	<ButtonImage
		icon={heroXMark}
		round
		on:click={() => {
			destroyApp('popup');
		}}
	/>
</div>

<script>
import { persistentStore } from '~/common/store';
import { store } from '~/content/store';
import { getMessage } from '~/common/browserApi';
import PopupMenu from '~/content/lib/PopupMenu.svelte';
import ButtonImage from '~/lib/ButtonImage.svelte';
import { destroyApp } from '~/content/utils/appsHandler';
import { heroChevronLeft, heroChevronRight, heroXMark } from '~/icons/heroicons';

$: disabledPrev = $store.cacheIndex <= -$store.cacheTranslate.length;
$: disabledNext = $store.cacheIndex >= -1;

const getCacheItem = index => {
	const item = $store.cacheTranslate.at(index);

	$store.translated = item;
	$store.sourceLang = item.src;
	$persistentStore.targetLang = item.targetLang;
};

const cachePrev = () => {
	getCacheItem(--$store.cacheIndex);
};

const cacheNext = () => {
	getCacheItem(++$store.cacheIndex);
};
</script>
