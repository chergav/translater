class Store {
	public voices = $state<Promise<SpeechSynthesisVoice[]> | null>(null);
}

export const store = new Store();
