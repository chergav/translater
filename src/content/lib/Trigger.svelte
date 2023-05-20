<div class="flex flex-col">
	<div
		class="
			flex
			flex-row
			w-[30px]
			hover:w-max
			bg-white
			text-gray-800
			dark:bg-gray-900
			dark:text-white
			{isSettingsOpen ? 'w-max' : ''}
		"
	>
		<button
			class="p-.5"
			on:click={createPopup}
			use:tooltip={{ title: getMessage('tooltip_translate_text') }}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6"
			>
				<path
					d="M 1.964,22 H 3.452 L 4.588,18.416 H 8.876 L 9.996,22 h 1.568 L 7.58,10.272 H 5.932 Z M 4.956,17.248 5.532,15.44 c 0.416,-1.328 0.8,-2.592 1.168,-3.968 h 0.064 c 0.384,1.36 0.752,2.64 1.184,3.968 l 0.56,1.808 z"
				/>
				<path
					d="M 17.308,7.6439998 C 16.636,9.4359998 15.66,10.732 14.604,11.74 14.428,10.812 14.316,9.8359998 14.316,8.8119998 l 0.016,-0.656 c 0.736,-0.272 1.664,-0.512 2.704,-0.512 z m 1.824,-1.76 -1.264,-0.32 c -0.016,0.272 -0.096,0.688 -0.176,0.928 l -0.048,0.16 -0.592,-0.016 c -0.816,0 -1.792,0.144 -2.688,0.4 0.048,-0.672 0.096,-1.344 0.16,-1.968 1.968,-0.096 4.096,-0.32 5.776,-0.608 l -0.016,-1.184 c -1.632,0.384 -3.584,0.592 -5.616,0.688 l 0.192,-1.216 c 0.048,-0.224 0.112,-0.512 0.192,-0.72 l -1.344,-0.032 c 0.016,0.192 -0.016,0.48 -0.032,0.768 l -0.128,1.232 -1.088,0.016 c -0.688,0 -2.08,-0.112 -2.64,-0.208 l 0.032,1.2 c 0.656,0.048 1.904,0.112 2.592,0.112 l 0.976,-0.016 c -0.064,0.752 -0.144,1.552 -0.176,2.352 -2.208,1.024 -4,3.1200002 -4,5.1840002 0,1.36 0.832,2.016 1.888,2.016 0.88,0 1.84,-0.352 2.72,-0.88 l 0.256,0.896 1.152,-0.352 c -0.128,-0.4 -0.256,-0.832 -0.384,-1.296 1.36,-1.152 2.656,-2.928 3.568,-5.2000002 1.488,0.432 2.304,1.52 2.304,2.7360002 0,2.08 -1.792,3.568 -4.688,3.872 l 0.688,1.072 c 3.712,-0.592 5.232,-2.576 5.232,-4.88 0,-1.7600002 -1.184,-3.2320002 -3.184,-3.7600002 l 0.016,-0.064 c 0.08,-0.256 0.224,-0.688 0.32,-0.912 z m -5.936,2.768 v 0.288 C 13.196,10.14 13.356,11.436 13.58,12.572 c -0.816,0.576 -1.584,0.848 -2.208,0.848 -0.608,0 -0.912,-0.336 -0.912,-0.992 0,-1.312 1.184,-2.8960002 2.736,-3.7760002 z"
				/>
			</svg>
		</button>
		<button
			class="p-.5"
			on:click={createSettings}
			use:tooltip={{ title: getMessage('tooltip_settings') }}
		>			
			<Icon d={heroCog8Tooth} size="lg" />
		</button>
	</div>
</div>

<script>
import { createApp, destroyApp } from '~/content/utils/appsHandler';
import { getSelectedText } from '~/content/utils/rectUtils';
import { store } from '~/content/store';
import { tooltip } from '~/lib/tooltip';
import { getMessage } from '~/common/browserApi';
import Icon from '~/lib/Icon.svelte';
import { heroCog8Tooth } from '~/icons/heroicons';

let isSettingsOpen = false;

const createPopup = () => {
	$store.selectedText = getSelectedText();
	destroyApp('settings');
	createApp('popup');
	isSettingsOpen = false;
};

const createSettings = () => {
	destroyApp('popup');
	createApp('settings');
	isSettingsOpen = true;
};
</script>
