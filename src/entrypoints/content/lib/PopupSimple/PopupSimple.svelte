<div class="flex w-full flex-col">
	<header
		class={[
			'flex w-full items-center justify-between p-1',
			popupStore.dragging ? 'cursor-grabbing' : 'cursor-move',
		]}
		onmousedown={onDragStart}
		role="toolbar"
		tabindex="-1"
	>
		<div class="flex items-center gap-1">
			<CacheNav />
		</div>

		<div class="flex items-center gap-1">
			<Button
				icon={mdiSwapHorizontal}
				onclick={switchToFullMode}
				size="xs"
				title={browser.i18n.getMessage('popup_menu_switch_to_full_mode')}
			/>
			<Button
				icon={mdiClose}
				onclick={closePopup}
				size="xs"
				title="Close"
			/>
		</div>
	</header>

	<div class="rounded-[16px] bg-color-surface p-1">
		<div class="flex flex-col gap-1">
			<div class="scrollbar max-h-80 overflow-y-auto p-1 whitespace-pre-line">
				{#if providerStore.isSelectedProviderGoogle}
					<TranslationGoogle />
				{:else}
					<TranslationAi shouldShowRetry={false} />
				{/if}
				{#if store.translated?.dict}
					<div class="flex flex-col gap-1 pt-2 text-sm">
						{#each store.translated.dict as dict, index (index)}
							<div>
								<span class="text-color-on-surface-variant italic">{dict.pos}:</span>
								<span>{dict.terms.join(', ')}</span>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<script lang="ts">
import { PopupMode } from '~/types';
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/content/store.svelte';
import { popupStore } from '~/entrypoints/content/lib/popupStore.svelte';
import { providerStore } from '~/entrypoints/options/lib/Providers/providerStore.svelte';
import Button from '~/lib/Button.svelte';
import TranslationGoogle from '~/entrypoints/content/lib/PopupFull/lib/PopupMain/lib/TranslationGoogle/TranslationGoogle.svelte';
import TranslationAi from '~/entrypoints/content/lib/PopupFull/lib/PopupMain/lib/TranslationAi.svelte';
import CacheNav from '~/entrypoints/content/lib/PopupFull/lib/CacheNav.svelte';
import { mdiSwapHorizontal, mdiClose } from '@mdi/js';

interface Props  {
	onDragStart: (event: MouseEvent) => void
}

let { onDragStart }: Props = $props();

function switchToFullMode() {
	storage.settings.popupMode = PopupMode.Full;
}

function closePopup() {
	store.showPopup = false;
}
</script>
