<div class="mb-4">
	<Checkbox
		bind:checked={$persistentStore.inlineButtonShow}
		label={getMessage('options_inline_button_show')}
	/>
</div>
<div class="mb-4">
	<Checkbox
		bind:checked={$persistentStore.textFieldButtonShow}
		label={getMessage('options_text_field_button_show')}
	/>
</div>
<div class="mb-4">
	<p class="text-base mb-2">{getMessage('options_hide_button_on_sites')}</p>
	{#each $persistentStore.blacklistDomainForInline as domain}
		<span
			class="
				mr-1
				mb-1
				px-1.5
				py-.5
				bg-gray-200
				dark:bg-gray-700
				rounded
				inline-flex
				items-center
			"
			>{domain}
			<button
				on:click={() => {
					deleteFromBlacklist(domain);
				}}
			>
				<Icon d={heroXMark} class="ml-1" />
			</button>
		</span>
	{:else}
		<span class="text-sm text-gray-500">
			{getMessage('options_hide_button_on_sites_empty_list')}
		</span>
	{/each}
</div>

<script>
import { getMessage } from '~/common/browserApi';
import { persistentStore } from '~/common/store';
import Checkbox from '~/lib/Checkbox.svelte';
import Icon from '~/lib/Icon.svelte';
import { heroXMark } from '@icons/heroicons';

const deleteFromBlacklist = domain => {
	const { blacklistDomainForInline } = $persistentStore;
	$persistentStore.blacklistDomainForInline = blacklistDomainForInline.filter(i => i !== domain);
};
</script>
