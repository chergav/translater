<div class="flex gap-1">
	<ButtonImage
		round
		{disabled}
		tooltip={{ title: getMessage('tooltip_go_back') }}
		on:click={cachePrev}
	>
		<Icon d={heroChevronLeft} />
	</ButtonImage>
	<ButtonImage
		round
		disabled={disabledNext}
		tooltip={{ title: getMessage('tooltip_go_forward') }}
		on:click={cacheNext}
	>
		<Icon d={heroChevronRight} />
	</ButtonImage>
</div>
<div class="flex gap-1">
	<ButtonImage
		round
		tooltip={{
			title: $persistentStore.pinWindow
				? getMessage('tooltip_unpin_window')
				: getMessage('tooltip_pin_window'),
		}}
		on:click={() => {
			$persistentStore.pinWindow = !$persistentStore.pinWindow;
		}}
	>
		{#if $persistentStore.pinWindow}
			<Icon filled stroke="none" d={mdiPin} />
		{:else}
			<Icon filled stroke="none" d={mdiPinOff} />
		{/if}
	</ButtonImage>
	<ButtonImage round>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-5 h-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
			/>
		</svg>
	</ButtonImage>

	<ButtonImage
		round
		tooltip={{ title: 'close window' }}
		on:click={() => {
			destroyApp('popup');
		}}
	>
		<Icon d={heroXMark} />
	</ButtonImage>
</div>

<script>
import { persistentStore } from '~/common/store';
import { store } from '~/content/store';
import { getMessage } from '~/common/browserApi';
import ButtonImage from '~/lib/ButtonImage.svelte';
import { destroyApp } from '~/content/utils/appsHandler';
import Icon from '~/lib/Icon.svelte';
import { heroChevronLeft, heroChevronRight, heroXMark } from '~/icons/heroicons';
import { mdiPin, mdiPinOff } from '~/icons/mdi';

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
