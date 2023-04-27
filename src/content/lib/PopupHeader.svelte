<header class="p-2 flex justify-between border-b border-gray-300 dark:border-gray-700">
	<div class="flex gap-2">
		<ButtonImage
			{disabled}
			tooltip={{ title: getMessage('tooltip_go_back') }}
			on:click={cachePrev}
		>
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
					d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
				/>
			</svg>
		</ButtonImage>
		<ButtonImage
			disabled={disabledNext}
			tooltip={{ title: getMessage('tooltip_go_forward') }}
			on:click={cacheNext}
		>
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
					d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
				/>
			</svg>
		</ButtonImage>
	</div>
	<ButtonClose
		on:click={() => {
			destroyApp('popup');
		}}
	/>
</header>

<script>
import { persistentStore } from '~/common/store';
import { store } from '../store';
import { getMessage } from '~/common/browserApi';
import ButtonImage from '~/lib/ButtonImage.svelte';
import ButtonClose from '~/lib/ButtonClose.svelte';
import { destroyApp } from '../utils/appsHandler';

let cacheIndex = -1,
	disabledPrev = false,
	disabledNext = true;

$: disabled = $store.translateCache.length < 2 || disabledPrev;

const historyItem = index => $store.translateCache.at(index);

const promise = data => new Promise((res, _) => { res(data); });

const cacheItem = index => {
	const item = historyItem(index);

	$store.translated = promise(item);

	$store.sourceLang = item.src;
	$persistentStore.targetLang = item.targetLang;

	if (index <= -$store.translateCache.length) {
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
