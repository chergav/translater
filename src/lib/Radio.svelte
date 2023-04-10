{#each options as { key, value }}
	<div class="mb-4">
		<label
			class="
				inline-flex
				flex-row
				items-center
				cursor-pointer
			"
		>
			<input
				type="radio"
				class="
					mr-3
					w-[18px]
					h-[18px]
					rounded-full
					text-blue-500
					bg-transparent
					focus:ring-1
					focus:ring-blue-500
					border
					checked:border-none
					border-gray-300
					dark:border-gray-700
					dark:ring-offset-gray-800
				"
				value={key}
				bind:group={selected}
			>
			<span class="select-none">{getMessage(value)}</span>
		</label>
	</div>
{/each}

<script>
import { getMessage } from '~/common/browserApi';
export let options;
export let selected;
</script>
