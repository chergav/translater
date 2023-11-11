{#each options as { key, value }}
	<div>
		<label
			class="
				relative
				inline-flex
				items-center
				cursor-pointer
			"
		>
			<input class="sr-only peer" type="radio" value={key} bind:group={selected} />
			<!-- outer circle -->
			<svg
				class="
					w-5
					h-5
					ring-[10px]
					ring-transparent
					rounded-full
					fill-gray-600
					dark:fill-gray-400
					peer-checked:fill-blue-800
					peer-checked:dark:fill-blue-200

					peer-focus-visible:outline
					peer-focus-visible:outline-offset-8
					peer-focus-visible:outline-gray-600
					peer-focus-visible:dark:outline-gray-400

					transition-all
				"
				viewBox="0 0 20 20"
			>
				<mask id="cutout">
					<rect fill="white" height="100%" width="100%" />
					<circle cx="10" cy="10" fill="black" r="8" />
				</mask>
				<circle cx="10" cy="10" mask="url(#cutout)" r="10" />
			</svg>
			<!-- inner circle -->
			<svg
				class="
					absolute
					w-5
					h-5
					fill-blue-800
					dark:fill-blue-200
					opacity-0
					peer-checked:opacity-100
					peer-checked:animate-circle_grow
					transition-opacity
					duration-[50ms]
				"
				viewBox="0 0 20 20"
			>
				<circle cx="10" cy="10" r="5" />
			</svg>
			<!-- hover elem -->
			<div
				class="
					absolute
					w-10
					h-10
					-ml-[10px]
					rounded-full
					peer-hover:bg-gray-600/10
					peer-hover:dark:bg-gray-400/10
					peer-checked:peer-hover:bg-blue-800/10
					peer-checked:peer-hover:dark:bg-blue-200/10
					transition-colors
				"
			/>
			<span class="ml-4 text-gray-900 dark:text-gray-300 select-none">{getMessage(value)}</span>
		</label>
	</div>
{/each}

<script>
import { getMessage } from '~/common/browserApi';
export let options;
export let selected;
</script>
