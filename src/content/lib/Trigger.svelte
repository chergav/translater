<div class="flex flex-col">
	<div
		class="
			flex
			flex-row
			w-[30px]
			hover:w-max
			rounded-lg
			bg-gray-50
			text-gray-900
			dark:bg-gray-800
			dark:text-white
			border
			border-gray-300
			dark:border-gray-700
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
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<g
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="m 4.1231249,4.55 q -0.15,0 -0.15,-0.15 0,-0.15 0.15,-0.15 H 15.373125 q 0.15,0 0.15,0.15 0,0.195 -0.03,0.285 -0.465,1.65 -1.53,2.865 -1.05,1.215 -2.61,1.89 -0.12,0.045 -0.18,-0.09 -0.06,-0.135 0.09,-0.195 2.97,-1.305 3.915,-4.485 0.03,-0.12 -0.09,-0.12 z m 4.8,1.8 q 0,-0.15 0.15,-0.15 0.15,0 0.15,0.15 -0.03,3.69 -0.99,5.745 -0.945,2.055 -3.03,2.895 -0.12,0.045 -0.18,-0.09 -0.06,-0.135 0.075,-0.195 1.995,-0.795 2.895,-2.775 0.9,-1.995 0.93,-5.58 z"
					/>
					<path
						d="m 15.793125,9.07 -2.4,6.51 q -0.03,0.12 0.075,0.12 h 4.68 q 0.105,0 0.075,-0.12 l -2.4,-6.51 q 0,-0.015 -0.015,-0.015 -0.015,0 -0.015,0.015 z m -4.095,10.68 q -0.06,0 -0.105,-0.045 -0.03,-0.045 0,-0.105 l 3.915,-10.59 q 0.075,-0.21 0.285,-0.21 0.225,0 0.315,0.21 l 3.915,10.59 q 0.015,0.06 -0.03,0.105 -0.03,0.045 -0.075,0.045 -0.165,0 -0.21,-0.15 l -1.29,-3.48 q -0.06,-0.12 -0.165,-0.12 h -4.89 q -0.12,0 -0.165,0.12 l -1.29,3.48 q -0.06,0.15 -0.21,0.15 z"
					/>
				</g>
			</svg>
		</button>
		<button
			class="p-.5"
			on:click={createSettings}
			use:tooltip={{ title: getMessage('tooltip_settings') }}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		</button>
	</div>
</div>

<script>
import { createApp, destroyApp } from '../utils/appsHandler';
import { tooltip } from '~/lib/tooltip';
import { getMessage } from '~/common/browserApi';

let isSettingsOpen = false;

const createPopup = () => {
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
