<div class="flex w-full flex-col gap-2">
	<div class="flex w-full items-center gap-2">
		<Input
			disabled={!providerStore.isCustomProvider}
			error={modelError}
			focus={!model.model}
			hiddenHint={providerStore.isCustomProvider ? 'Make sure the model is a chat model' : undefined}
			label="Model"
			onblur={setModel}
			oninput={validateModel}
			placeholder="e.g. deepseek-ai/DeepSeek-V3"
			required={providerStore.isCustomProvider}
			spellcheck="false"
			value={model.model}
		/>
		{#if selectedModel}
			<div class="self-end py-2" title="Selected model">
				<Icon class="text-color-primary" d={mdiCheckCircleOutline} />
			</div>
		{/if}
	</div>

	<Button
		disabled={disabledSelect || selectedModel}
		icon={mdiCheck}
		label="Use this model"
		onclick={selectModel}
	/>

	{#if providerStore.isCustomProvider}
		<Button
			disabled={disabledSelect || testRequestPending}
			icon={testRequestPending ? mdiLoading : mdiCheckNetworkOutline}
			iconClass={[testRequestPending && 'animate-spin']}
			label="Test request"
			onclick={testRequest}
		/>
		<Button
			icon={mdiTrashCanOutline}
			label="Delete model"
			onclick={deleteModel}
			variant="danger"
		/>
		<div class="text-sm">
			{#if testResponse}
				<div class="inline-flex items-center gap-1">
					<span>{testResponse.model}:</span>
					<span class="text-green-500">{testResponse.choices[0].message.content}</span>
				</div>
				<!-- {JSON.stringify(response, null, 2)} -->
			{/if}
			{#if errorResponse}
				<span class="text-color-error">{errorResponse.message}</span>
			{/if}
		</div>
	{/if}

	<!-- <pre class="text-sm">
		{JSON.stringify(model, null, 2)}
	</pre> -->
</div>

<script lang="ts">
import type { TranslationModel } from '~/types/providers';
import { storage } from '~/shared/storage.svelte';
import { providerStore } from '../providerStore.svelte';
import Input from '~/lib/Input.svelte';
import Button from '~/lib/Button.svelte';
import Icon from '~/lib/Icon.svelte';
import { mdiTrashCanOutline, mdiCheckCircleOutline, mdiCheck, mdiCheckNetworkOutline, mdiLoading } from '@mdi/js';
import { testProviderConnection } from '../utils/testProviderConnection';
import { OpenAI } from 'openai';

interface Props {
	model: TranslationModel
}

let { model }: Props = $props();
let testResponse = $state<OpenAI.ChatCompletion>();
let errorResponse = $state<OpenAI.ErrorObject>();
let testRequestPending = $state<boolean>(false);
let modelError = $state<string>();
const selectedModel = $derived<boolean>(model.id === storage.settings.modelId);
const disabledSelect = $derived<boolean>(
	providerStore.activeTabProviderUnfinishedSetup ||
	!model.model ||
	providerStore.isTranslationAPIUnavailable,
);

function validateAndUpdateModel(target: HTMLInputElement, shouldSave: boolean = true): boolean {
	const value = target.value.trim();
	const isValid = value.length > 0;

	if (isValid) {
		modelError = undefined;
		if (shouldSave) {
			providerStore.updateModel(model.id, value);
		}
	} else {
		modelError = 'Model required';
	}

	return isValid;
}

function setModel(event: Event) {
	const target = event.target as HTMLInputElement;
	validateAndUpdateModel(target, true);
}

function validateModel(event: Event) {
	if (modelError !== undefined) {
		const target = event.target as HTMLInputElement;
		validateAndUpdateModel(target, false);
	}
}

function selectModel() {
	providerStore.selectModel(model.id);
}

function deleteModel() {
	if (confirm('Are you sure?')) {
		providerStore.deleteModel(model.id);
	}
}

async function testRequest() {
	testResponse = undefined;
	errorResponse = undefined;
	testRequestPending = true;

	try {
		testResponse = await testProviderConnection(providerStore.activeTabProvider, model.model);
		console.log($state.snapshot(testResponse));
	} catch (error) {
		console.log({ error });
		errorResponse = error as OpenAI.ErrorObject;
	} finally {
		testRequestPending = false;
	}
}
</script>
