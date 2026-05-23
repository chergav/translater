<div class="flex flex-col gap-4">
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
		<Alert text={provider.note} />
	{/if}

	<TextField
		disabled={!providerStore.isCustomProvider}
		label={browser.i18n.getMessage('options_providers_provider')}
		onblur={setProviderName}
		value={provider.name}
		variant="outlined"
	/>

	{#if providerStore.isCustomProvider}
		<TextField
			error={!!baseUrlError}
			errorText={baseUrlError}
			// focus={!provider.baseUrl}
			label="Base URL"
			onblur={setBaseUrl}
			oninput={validateBaseUrl}
			placeholder="e.g. https://router.huggingface.co/v1"
			required
			spellcheck="false"
			supportingText="Make sure the provider is compatible with the OpenAI API"
			type="url"
			value={provider.baseUrl || ''}
			variant="outlined"
		/>
		<TextField
			error={!!apiKeyError}
			errorText={apiKeyError}
			label="API Key"
			onblur={setApiKey}
			oninput={validateApiKey}
			required
			spellcheck="false"
			supportingText="Don't worry, your API key will only be stored on your device"
			value={provider.apiKey || ''}
			variant="outlined"
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
				color="outlined"
				label="Add model"
				onclick={providerStore.addModel}
			>
				{#snippet leadingIcon()}
					<Add />
				{/snippet}
			</Button>
		{/if}
	</div>

	{#if providerStore.isCustomProvider}
		<div class="my-1 border-b border-color-outline-variant"></div>
		<Button
			label="Delete provider"
			onclick={deleteProvider}
		>
			{#snippet leadingIcon()}
				<Delete />
			{/snippet}
		</Button>
	{/if}

	<!-- <pre class="text-sm">
		{JSON.stringify(provider, null, 2)}
	</pre> -->
</div>

<script lang="ts">
import { type TranslationProvider } from '~/types/providers';
import { providerStore } from '../providerStore.svelte';
import Button from '~/lib/base/Button.svelte';
import TextField from '~/lib/base/TextField.svelte';
import Alert from '~/lib/base/Alert.svelte';
import Model from './Model.svelte';
import Add from '~icons/material-symbols/add-rounded';
import Delete from '~icons/material-symbols/delete-outline-rounded';

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
