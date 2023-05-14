<header class="p-2 flex justify-between border-b border-gray-300 dark:border-gray-700 leading-[0]">
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
	<div class="flex gap-2">
		<ButtonImage
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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 24 24"
					class="w-5 h-5"
				>
					<path
						d="M2.79,4.46L3.5,3.75L20.25,20.5L19.54,21.21L14.33,16H12V20.5L11.5,22L11,20.5V16H6V14H6L8,12V9.66L2.79,4.46M14,12.41V5H15V4H8V5H9V7.84L8,6.84V6H7.16L7,5.84V3H16V6H15V12L17,14V14H17V14H17V15.83L16,14.84V14.41L14,12.41M9,12.41L7,14.41V15H13.34L9,10.66V12.41Z"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 24 24"
					class="w-5 h-5"
				>
					<path
						d="M14,12.41V5H15V4H8V5H9V12.41L7,14.41V15H16V14.41L14,12.41M17,14V14H17V14L17,16H12V20.5L11.5,22L11,20.5V16H6V14H6L8,12V6H7V3H16V6H15V12L17,14V14Z"
					/>
				</svg>
			{/if}
		</ButtonImage>
		<ButtonClose
			on:click={() => {
				destroyApp('popup');
			}}
		/>
	</div>
</header>

<script>
import { persistentStore } from '~/common/store';
import { store } from '~/content/store';
import { getMessage } from '~/common/browserApi';
import ButtonImage from '~/lib/ButtonImage.svelte';
import ButtonClose from '~/lib/ButtonClose.svelte';
import { destroyApp } from '~/content/utils/appsHandler';

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
