<div class={$themeClass}>
	<div
		class="
			absolute
			z-[99999]
			overflow-hidden
			rounded-[6px]
			text-sm
			bg-white
			dark:bg-gray-800
			shadow-xl
			border
			border-gray-300
			dark:border-gray-700
			text-gray-800
			dark:text-white
			text-start
			select-none
		"
		use:settingsPosition
		use:clickOutside
		on:click_outside={() => {
			destroyApp('settings');
		}}
		style="left: {left}px; top: {top}px;"
	>
		<div class="w-full">
			<div class="p-2 flex justify-end">
				<ButtonImage
					round
					on:click={() => {
						destroyApp('settings');
					}}
				>
				<Icon d={heroXMark} />
				</ButtonImage>
			</div>
			<ul>
				<li class="p-2">
					<Checkbox
						bind:checked={isDomainInBlacklist}
						on:change={addDomainToBlacklist}
						label={getMessage('popup_settings_disable_inline_button_for_site')}
					/>
				</li>
				<li class="p-2">
					<Checkbox
						bind:checked={$persistentStore.inlineButtonShow}
						label={getMessage('popup_settings_enable_inline_button_global')}
					/>
				</li>
			</ul>
			<div class="p-2 border-t border-gray-300 dark:border-gray-700">
				<button
					class="
						inline-flex
						items-center
						text-blue-500
						underline
						hover:no-underline								
					"
					on:click={openOptionsPage}
				>
					<span>{getMessage('popup_settings_options_link')}</span>
					<span>
						<Icon d={heroArrowTopRightOnSquare} class="ml-1" />
					</span>
				</button>
			</div>
		</div>
	</div>
</div>

<script>
import { destroyApp } from './utils/appsHandler';
import { getMessage } from '~/common/browserApi';
import { computePosition, offset, flip, shift } from '@floating-ui/dom';
import { persistentStore, themeClass } from '~/common/store';
import { store } from './store';
import ButtonImage from '~/lib/ButtonImage.svelte';
import Checkbox from '~/lib/Checkbox.svelte';
import { clickOutside } from './utils/clickOutside';
import Icon from '~/lib/Icon.svelte';
import { heroXMark, heroArrowTopRightOnSquare } from '~/icons/heroicons';

const reference = {
	getBoundingClientRect: () => $store.selectedEndCoord,
};

let left = 0,
	top = 0;

$: isDomainInBlacklist = $persistentStore.blacklistDomainForInline.includes($store.hostname);

const settingsPosition = settings => {
	computePosition(reference, settings, {
		strategy: 'absolute',
		placement: 'bottom-end',
		middleware: [
			offset(({ rects, placement }) => ({
				mainAxis: placement === 'bottom-end' ? rects.floating.y + 31 : rects.floating.y + 1,
				alignmentAxis: -rects.floating.width + 15, // 15 - half button width
			})),
			flip({ flipAlignment: false }),
			shift({ padding: 10 }),
		],
	}).then(({ x, y }) => {
		left = x;
		top = y;
	});
};

const addDomainToBlacklist = () => {
	const { blacklistDomainForInline } = $persistentStore;
	const { hostname } = $store;

	$persistentStore.blacklistDomainForInline = isDomainInBlacklist
		? blacklistDomainForInline.filter(i => i !== hostname)
		: [...blacklistDomainForInline, hostname];
};

const openOptionsPage = () => {
	chrome.runtime.sendMessage({
		type: 'openOptionsPage',
		content: {
			hash: '#inline_translate',
		},
	});
};
</script>
