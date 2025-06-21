<div class="w-fit flex flex-col gap-2 items-center">
	<p class="text-sm">Let us know your vibe:</p>
	<div class="flex items-center gap-2">
		{#each buttons as { label, handler } (label)}
			<button
				class={[
					'px-4 py-0.5 inline-flex text-lg rounded-full select-none transition-colors',
					'border border-variant-300-700 hover:bg-accent-primary/10',
				]}
				onclick={handler}
				type="button"
			>{label}</button>
		{/each}
	</div>
</div>

<script lang="ts">
import { RATE_MAX_URL, RATE_LESS_URL } from '~/shared/constants';

interface Buttons {
	label: string
	handler: () => void
}

const buttons: Buttons[] = [
	{
		label: '😔',
		handler: openGoogleForm,
	},
	{
		label: '😐',
		handler: openGoogleForm,
	},
	{
		label: '🤩',
		handler: openCWSReviews,
	},
];

function openGoogleForm() {
	browser.tabs.create({ url: RATE_LESS_URL });
}

function openCWSReviews() {
	browser.tabs.create({ url: RATE_MAX_URL });
}
</script>
