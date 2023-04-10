<header class="p-2 flex justify-between border-b border-gray-300 dark:border-gray-700">
	<div class="flex gap-2">
		<ButtonImage
			{disabled}
			tooltip={{ title: 'back' }}
			on:click={cachePrev}
			
		>
		<!-- use:longpress
			on:longpress={() => { console.log('longpress'); }} -->
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
			tooltip={{ title: 'forward' }}
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
import { store } from '../store';
import ButtonImage from '~/lib/ButtonImage.svelte';
import ButtonClose from '~/lib/ButtonClose.svelte';
import { destroyApp } from '../utils/appsHandler';
import { longpress } from '~/content/utils/longpress';

let historyCurrentIndex = -1,
	disabledPrev = false,
	disabledNext = true;

$: disabled = $store.translateCache.length < 2 || disabledPrev;

const historyItem = index => $store.translateCache.at(index);

const promise = data => new Promise((res, _) => { res(data); });

const cachePrev = () => {
	disabledNext = false;

	const item = historyItem(--historyCurrentIndex);

	$store.translated = promise(item);

	if (historyCurrentIndex <= -$store.translateCache.length) {
		disabledPrev = true;
	}
};

const cacheNext = () => {	
	disabledPrev = false;

	const item = historyItem(++historyCurrentIndex);

	$store.translated = promise(item);

	if (historyCurrentIndex >= -1) {
		disabledNext = true;
	}
};
</script>
