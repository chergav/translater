{#each options as { key, value }}
	<div class="mb-4">
		<label
			class="
				relative
				inline-flex
				items-center
				cursor-pointer
			"
		>
			<input type="radio" class="sr-only peer" value={key} bind:group={selected} />
			<!-- outer circle -->
			<svg
				class="
					w-5
					h-5
					fill-gray-600
					dark:fill-gray-400
					peer-checked:fill-blue-600
					transition-colors
				"
				viewBox="0 0 20 20"
			>
				<mask id="cutout">
					<rect width="100%" height="100%" fill="white" />
					<circle cx="10" cy="10" r="8" fill="black" />
				</mask>
				<circle cx="10" cy="10" r="10" mask="url(#cutout)" />
			</svg>
			<!-- inner circle -->
			<svg
				class="
					absolute
					w-5
					h-5
					fill-blue-600
					opacity-0
					peer-checked:opacity-100
					peer-checked:animate-circle_grow
					transition-opacity
				"
				viewBox="0 0 20 20"
			>
				<circle cx="10" cy="10" r="5" />
			</svg>
			<span class="ml-3 text-gray-900 dark:text-gray-300 select-none">{getMessage(value)}</span>
		</label>
	</div>
{/each}

<script>
import { getMessage } from '~/common/browserApi';
export let options;
export let selected;
</script>
