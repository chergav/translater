<div class="p-6 flex flex-col gap-6">
	<SelectLanguageSimple
		label={browser.i18n.getMessage('target_lang_label')}
		bind:value={storage.settings.targetLang}
	/>
	<Checkbox
		label={browser.i18n.getMessage('options_inline_button_show')}
		bind:checked={storage.settings.inlineButtonShow}
	/>
	<Checkbox
		label={browser.i18n.getMessage('options_text_field_button_show')}
		bind:checked={storage.settings.textFieldButtonShow}
	/>
	<div>
		<p class="text-base mb-2">{browser.i18n.getMessage('options_hide_button_on_sites')}</p>
		<div>
			{#each storage.settings.blacklistDomainForInline as domain, index (index)}
				<span
					class="
						mr-1
						mb-1
						px-1.5
						py-.5
						bg-surface-level-1
						rounded-lg
						inline-flex
						items-center
						gap-1
					"
					>{domain}
					<button
						class="cursor-pointer text-red-600 dark:text-red-400"
						onclick={() => {
							deleteFromBlacklist(domain);
						}}
						type="button"
					>
						<Icon d={mdiTrashCanOutline} size="18" />
					</button>
				</span>
			{:else}
				<span class="text-sm text-secondary">
					{browser.i18n.getMessage('options_hide_button_on_sites_empty_list')}
				</span>
			{/each}
		</div>
	</div>
</div>

<script lang="ts">
import { storage } from '~/shared/storage.svelte';
import SelectLanguageSimple from '~/lib/SelectLanguageSimple.svelte';
import Checkbox from '~/lib/Checkbox.svelte';
import Icon from '~/lib/Icon.svelte';
import { mdiTrashCanOutline } from '@mdi/js';

const deleteFromBlacklist = (domain: string) => {
	storage.settings.blacklistDomainForInline = storage.settings.blacklistDomainForInline.filter(i => i !== domain);
};
</script>
