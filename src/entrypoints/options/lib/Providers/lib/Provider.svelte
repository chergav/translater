<div class="flex max-w-xl flex-col gap-4">
	{#if providerStore.activeTabProviderUnfinishedSetup}
		<p class="text-sm text-color-error">
			To use this provider, complete the setup.
			<br>
			Please provide a base URL, API key, and at least one model.
		</p>
	{/if}

	{#if providerStore.isTranslationAPIUnavailable}
		<Alert
			text="Translator and Language Detector APIs are not available in your browser."
			variant="error"
		/>
	{/if}

	{#if provider.note}
		<Alert text={provider.note} title="Note" />
	{/if}

	<Input
		disabled={!providerStore.isCustomProvider}
		label="Provider"
		onblur={setProviderName}
		value={provider.name}
	/>

	{#if providerStore.isCustomProvider}
		<Input
			error={baseUrlError}
			focus={!provider.baseUrl}
			hiddenHint="Make sure the provider is compatible with the OpenAI API"
			label="Base URL"
			onblur={setBaseUrl}
			oninput={validateBaseUrl}
			placeholder="e.g. https://router.huggingface.co/v1"
			required
			spellcheck="false"
			type="url"
			value={provider.baseUrl || ''}
		/>
		<Input
			error={apiKeyError}
			hiddenHint="Don't worry, your API key will only be stored on your device"
			label="API Key"
			onblur={setApiKey}
			oninput={validateApiKey}
			required
			spellcheck="false"
			value={provider.apiKey || ''}
		/>
	{/if}

	<div class="flex flex-col gap-3">
		{#each provider.models as model (model.id)}
			<Model {model} />
		{/each}
		{#if providerStore.isCustomProvider}
			<span class="text-sm">
				<span class="text-color-error">*</span> - required fields
			</span>
			<Button
				icon={mdiPlus}
				label="Add model"
				onclick={providerStore.addModel}
				variant="outlined"
			/>
		{/if}
	</div>

	{#if providerStore.isCustomProvider}
		<div class="my-1 border-b border-color-surface-high"></div>
		<Button
			icon={mdiTrashCanOutline}
			label="Delete provider"
			onclick={deleteProvider}
			variant="danger"
		/>
	{/if}

	<!-- <pre class="text-sm">
		{JSON.stringify(provider, null, 2)}
	</pre> -->
</div>

<script lang="ts">
import { type TranslationProvider } from '~/types/providers';
import { providerStore } from '../providerStore.svelte';
import Button from '~/lib/Button.svelte';
import Input from '~/lib/Input.svelte';
import Alert from '~/lib/Alert.svelte';
import Model from './Model.svelte';
import { mdiPlus, mdiTrashCanOutline } from '@mdi/js';

interface Props {
	provider: TranslationProvider
}

let { provider }: Props = $props();
let baseUrlError = $state<string>();
let apiKeyError = $state<string>();

function setProviderName(event: Event) {
	const target = event.target as HTMLInputElement;
	const name = target.value.trim() || 'Custom Provider';

	providerStore.updateProvider({ name });
}

function validateAndUpdateBaseUrl(target: HTMLInputElement, shouldSave: boolean = true): boolean {
	const isValid = target.checkValidity();
	const value = target.value.trim();

	if (isValid && value) {
		baseUrlError = undefined;
		if (shouldSave) {
			providerStore.updateProvider({ baseUrl: target.value.trim() });
		}
	} else {
		baseUrlError = value ? 'Invalid Base URL' : 'Base URL required';
	}

	return isValid;
}

function setBaseUrl(event: Event) {
	const target = event.target as HTMLInputElement;
	validateAndUpdateBaseUrl(target, true);
}

function validateBaseUrl(event: Event) {
	if (baseUrlError !== undefined) {
		const target = event.target as HTMLInputElement;
		validateAndUpdateBaseUrl(target, false);
	}
}

function validateAndUpdateApiKey(target: HTMLInputElement, shouldSave: boolean = true): boolean {
	const value = target.value.trim();
	const isValid = value.length > 0;

	if (isValid) {
		apiKeyError = undefined;
		if (shouldSave) {
			providerStore.updateProvider({ apiKey: value });
		}
	} else {
		apiKeyError = 'API Key required';
	}

	return isValid;
}

function setApiKey(event: Event) {
	const target = event.target as HTMLInputElement;
	validateAndUpdateApiKey(target, true);
}

function validateApiKey(event: Event) {
	if (apiKeyError !== undefined) {
		const target = event.target as HTMLInputElement;
		validateAndUpdateApiKey(target, false);
	}
}

function deleteProvider() {
	if (confirm('Are you sure?')) {
		providerStore.deleteProvider(provider.id);
	}
}
</script>
