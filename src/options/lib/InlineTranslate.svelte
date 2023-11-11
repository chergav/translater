<div class="p-6 flex flex-col gap-4">
	<SelectLang
		label={getMessage('target_lang_label')}
		{languages}
		bind:value={$persistentStore.targetLang}
	/>
	<Checkbox
		label={getMessage('options_inline_button_show')}
		bind:checked={$persistentStore.inlineButtonShow}
	/>
	<Checkbox
		label={getMessage('options_text_field_button_show')}
		bind:checked={$persistentStore.textFieldButtonShow}
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
					type="button"
					on:click={() => {
						deleteFromBlacklist(domain);
					}}
				>
					<Icon class="ml-1" d={heroXMark} />
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
