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
			<SelectModel/>
		</div>
		<div class="flex items-center gap-1">
			<Menu />
			<Button icon={mdiClose} onclick={closePopup} size="xs" title="Close" />
		</div>
	</header>

	<PopupMain />

	<PopupFooter />
</div>

<script lang="ts">
import { store } from '~/entrypoints/content/store.svelte';
import { popupStore } from '~/entrypoints/content/lib/popupStore.svelte';
import Button from '~/lib/Button.svelte';
import Menu from './lib/Menu.svelte';
import CacheNav from './lib/CacheNav.svelte';
import SelectModel from './lib/SelectModel.svelte';
import PopupMain from './lib/PopupMain/PopupMain.svelte';
import PopupFooter from './lib/PopupFooter/PopupFooter.svelte';
import { mdiClose } from '@mdi/js';

interface Props  {
	onDragStart: (event: MouseEvent) => void
}

let { onDragStart }: Props = $props();

function closePopup() {
	store.showPopup = false;
}
</script>
