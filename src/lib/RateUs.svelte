<div class="flex w-fit flex-col items-center gap-2">
	<p class="text-sm">Let us know your vibe:</p>
	<div class="flex items-center gap-2">
		{#each buttons as { label, handler } (label)}
			<Button
				class="text-lg"
				{label}
				onclick={handler}
				size="xs"
				variant="outlined"
			/>
		{/each}
	</div>
</div>

<script lang="ts">
import Button from '~/lib/Button.svelte';
import { RATE_MAX_URL, RATE_LESS_URL, RATE_MAX_URL_FIREFOX } from '~/shared/constants';

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
	const url = import.meta.env.FIREFOX ? RATE_MAX_URL_FIREFOX : RATE_MAX_URL;
	browser.tabs.create({ url });
}
</script>
