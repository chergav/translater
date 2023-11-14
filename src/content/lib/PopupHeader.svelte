<div class="flex gap-1">
	<ButtonImage
		{disabled}
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

let cacheIndex = -1,
	disabledPrev = false,
	disabledNext = true;

$: disabled = $store.cacheTranslate.length < 2 || disabledPrev;

const historyItem = index => $store.cacheTranslate.at(index);

const cacheItem = index => {
	const item = historyItem(index);

	$store.translated = item;
	$store.sourceLang = item.src;
	$persistentStore.targetLang = item.targetLang;

	if (index <= -$store.cacheTranslate.length) {
		disabledPrev = true;
	} else {
		disabledPrev = false;
	}

	if (index >= -1) {
		disabledNext = true;
	} else {
		disabledNext = false;
	}
};

const cachePrev = () => {
	cacheItem(--cacheIndex);
};

const cacheNext = () => {
	cacheItem(++cacheIndex);
};
</script>
