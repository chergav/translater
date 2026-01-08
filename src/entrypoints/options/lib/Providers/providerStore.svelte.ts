import { TranslationProvider, TranslationModel, ProviderId, GOOGLE_TRANSLATE_MODEL_ID } from '~/types/providers';
import { storage } from '~/shared/storage.svelte';
import { storageSync } from '~/shared/storageSync.svelte';
import { builtinProviders } from '~/shared/providers';

class ProviderStore {
	public providers = $derived<TranslationProvider[]>([...builtinProviders, ...storageSync.settings.customProviders]);
	public selectedProvider = $derived<TranslationProvider>(this.findProviderByModelId(storage.settings.modelId, this.providers));
	public selectedModel = $derived<TranslationModel>(
		this.selectedProvider.models.find(m => m.id === storage.settings.modelId) || builtinProviders[0].models[0],
	);
	public isSelectedProviderGoogle = $derived<boolean>(storage.settings.modelId === GOOGLE_TRANSLATE_MODEL_ID);
	public activeTabProviderId = $state<string>(this.selectedProvider.id);
	public activeTabProvider = $derived(this.providers.find(provider => provider.id === this.activeTabProviderId) || builtinProviders[0]);
	public activeCustomProviderIndex = $derived<number>(
		storageSync.settings.customProviders.findIndex(provider => provider.id === this.activeTabProviderId),
	);
	public activeTabProviderUnfinishedSetup = $derived<boolean>(this.isUnfinishedSetup(this.activeTabProvider));
	public isCustomProvider = $derived<boolean>(!this.activeTabProvider.isBuiltin);
	public isTranslationAPIAvailable = $state<boolean>(true);
	public isTranslationAPIUnavailable = $derived<boolean>(
		this.activeTabProviderId === ProviderId.TranslatorApi && !providerStore.isTranslationAPIAvailable,
	);

	private findProviderByModelId(modelId: string, providers: TranslationProvider[]) {
		return providers.find(p => p.models.some(m => m.id === modelId)) || builtinProviders[0];
	}

	public isUnfinishedSetup(provider: TranslationProvider): boolean {
		return !provider.isBuiltin && (
			!provider.baseUrl ||
			!provider.apiKey ||
			!provider.models.some(m => m.model)
		);
	}

	public addProvider = () => {
		alert('This feature will be available soon.');
		// const id = crypto.randomUUID();

		// storageSync.settings.customProviders.push({
		// 	id,
		// 	name: 'Custom Provider',
		// 	protocol: 'openai-stream',
		// 	isBuiltin: false,
		// 	requiresSubscription: false,
		// 	models: [],
		// });

		// this.activeTabProviderId = id;
	};

	public updateProvider = (updates: Partial<TranslationProvider>) => {
		if (this.activeCustomProviderIndex === -1) return;

		storageSync.settings.customProviders[this.activeCustomProviderIndex] = {
			...storageSync.settings.customProviders[this.activeCustomProviderIndex],
			...updates,
		};
	};

	public deleteProvider = (providerId: string) => {
		storageSync.settings.customProviders = storageSync.settings.customProviders.filter(p => p.id !== providerId);

		if (this.selectedProvider.id === providerId) {
			storage.settings.modelId = GOOGLE_TRANSLATE_MODEL_ID;
		}

		this.activeTabProviderId = ProviderId.GoogleTranslate;
	};

	public addModel = () => {
		if (this.activeCustomProviderIndex === -1) return;

		const id = crypto.randomUUID();

		storageSync.settings.customProviders[this.activeCustomProviderIndex].models.push({
			id,
			model: '',
		});
	};

	public updateModel = (id: string, model: string) => {
		if (this.activeCustomProviderIndex === -1) return;

		const modelIndex = storageSync.settings.customProviders[this.activeCustomProviderIndex].models.findIndex(
			m => m.id === id,
		);

		if (modelIndex === -1) return;

		storageSync.settings.customProviders[this.activeCustomProviderIndex].models[modelIndex].model = model;
	};

	public selectModel = (modelId: string) => {
		storage.settings.modelId = modelId;
	};

	public deleteModel = (modelId: string) => {
		if (this.activeCustomProviderIndex === -1) return;

		const wasActive = storage.settings.modelId === modelId;

		storageSync.settings.customProviders[this.activeCustomProviderIndex].models =
			storageSync.settings.customProviders[this.activeCustomProviderIndex].models.filter(m => m.id !== modelId);

		if (wasActive) {
			const validModel = this.activeTabProvider.models.find(m => m.model && m.model.trim() !== '');

			if (validModel) {
				storage.settings.modelId = validModel.id;
			} else {
				const defaultProvider = builtinProviders[0];
				storage.settings.modelId = defaultProvider.models[0].id;
				this.activeTabProviderId = defaultProvider.id;
			}
		}
	};
}

export const providerStore = new ProviderStore();
