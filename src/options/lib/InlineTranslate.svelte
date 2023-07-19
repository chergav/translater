<div class="p-6 flex flex-col gap-4">
	<SelectLang
		bind:value={$persistentStore.targetLang}
		label={getMessage('target_lang_label')}
		{languages}
	/>
	<Checkbox
		bind:checked={$persistentStore.inlineButtonShow}
		label={getMessage('options_inline_button_show')}
	/>
	<Checkbox
		bind:checked={$persistentStore.textFieldButtonShow}
		label={getMessage('options_text_field_button_show')}
	/>
	<div>
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
					rounded-lg
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
</div>

<script>
import { getMessage } from '~/common/browserApi';
import { persistentStore } from '~/common/store';
import { languages } from '~/common/settings';
import SelectLang from '~/lib/SelectLang.svelte';
import Checkbox from '~/lib/Checkbox.svelte';
import Icon from '~/lib/Icon.svelte';
import { heroXMark } from '~/icons/heroicons';

const deleteFromBlacklist = domain => {
	const { blacklistDomainForInline } = $persistentStore;
	$persistentStore.blacklistDomainForInline = blacklistDomainForInline.filter(i => i !== domain);
};
</script>
