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
			text-gray-900
			dark:text-white
			text-start
			select-none
		"
		use:settingsPosition
		style="left: {left}px; top: {top}px;"
	>
		<div class="w-full">
			<div class="p-2 flex justify-end">
				<ButtonClose />
			</div>
			<ul>
				<li>
					<label
						class="
							p-2
							flex
							items-center
							hover:bg-gray-200
							dark:hover:bg-gray-700
							transition-colors
							cursor-pointer
						"
					>
						<input
							type="checkbox"
							class="rounded mr-2"
							bind:checked={isDomainInBlacklist}
							on:change={addDomainToBlacklist}
						/>
						<span>{getMessage('tooltip_settings_disable_inline_button_for_site')}</span>
					</label>
				</li>
				<li>
					<label
						class="
							p-2
							flex
							items-center
							hover:bg-gray-200
							dark:hover:bg-gray-700
							transition-colors
							cursor-pointer
						"
					>
						<input
							type="checkbox"
							class="rounded mr-2"
							bind:checked={$persistentStore.inlineButtonShow}
						/>
						<span>{getMessage('tooltip_settings_enable_inline_button_global')}</span>
					</label>
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
					<span>{getMessage('tooltip_settings_options_link')}</span>
					<span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="ml-1 w-5 h-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
							/>
						</svg>
					</span>
				</button>
			</div>
		</div>
	</div>
</div>

<svelte:document on:click={removeSettings} />

<script>
import { apps } from './index';
import { getMessage, getURL } from '@/common/browserApi';
import { computePosition, offset, flip, shift } from '@floating-ui/dom';
import { persistentStore, themeClass } from '@/common/store';
import { store } from './store';
import ButtonClose from './lib/ButtonClose.svelte';

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
				mainAxis: placement === 'bottom-end'
					? rects.floating.y + 31
					: rects.floating.y + 1,
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
			hash: '#inline_translate'
		}
	});
};

const removeSettings = event => {
	const isLeftClick = event.button === 0;
	if (!isLeftClick) return;

	const settingsElem = document.querySelector(apps.settings.tag);
	if (!settingsElem) return;

	const isInTriggerElem = event.target.closest(apps.trigger.tag);
	if (isInTriggerElem) return;

	const isInSettingsElem = event.target.closest(apps.settings.tag);
	if (isInSettingsElem) return;

	$store.currentApp = null;
};
</script>
