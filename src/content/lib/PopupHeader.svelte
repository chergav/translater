<header class="p-2 flex justify-between border-b border-gray-300 dark:border-gray-700 leading-[0]">
	<div class="flex gap-2">
		<ButtonImage
			{disabled}
			tooltip={{ title: getMessage('tooltip_go_back') }}
			on:click={cachePrev}
		>
			<Icon d={heroArrowSmallLeft} />
		</ButtonImage>
		<ButtonImage
			disabled={disabledNext}
			tooltip={{ title: getMessage('tooltip_go_forward') }}
			on:click={cacheNext}
		>
			<Icon d={heroArrowSmallRight} />
		</ButtonImage>
	</div>
	<div class="flex gap-2">
		<ButtonImage
			round
			tooltip={{
				title: $persistentStore.pinWindow
					? getMessage('tooltip_unpin_window')
					: getMessage('tooltip_pin_window')
			}}
			on:click={() => {
				$persistentStore.pinWindow = !$persistentStore.pinWindow;
			}}
		>
			{#if $persistentStore.pinWindow}
				<Icon filled stroke="none" d={mdiPinOff} />
			{:else}
				<Icon filled stroke="none" d={mdiPin} />
			{/if}
		</ButtonImage>		
		<ButtonImage
			round
			on:click={() => {
				destroyApp('popup');
			}}
		>
		<Icon d={heroXMark} />
		</ButtonImage>
	</div>
</header>

<script>
import { persistentStore } from '~/common/store';
import { store } from '~/content/store';
import { getMessage } from '~/common/browserApi';
import ButtonImage from '~/lib/ButtonImage.svelte';
import { destroyApp } from '~/content/utils/appsHandler';
import Icon from '~/lib/Icon.svelte';
import { heroArrowSmallLeft, heroArrowSmallRight, heroXMark } from '@icons/heroicons';
import { mdiPin, mdiPinOff } from '@icons/mdi';

let cacheIndex = -1,
	disabledPrev = false,
	disabledNext = true;

$: disabled = $store.cacheTranslate.length < 2 || disabledPrev;

const historyItem = index => $store.cacheTranslate.at(index);

const promise = data =>
	new Promise((res, _) => {
		res(data);
	});

const cacheItem = index => {
	const item = historyItem(index);

	$store.translated = promise(item);

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
