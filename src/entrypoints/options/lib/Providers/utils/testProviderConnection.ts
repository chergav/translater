import type { TranslationProvider } from '~/types/providers';
import { OpenAI } from 'openai';

export async function testProviderConnection(provider: TranslationProvider, model: string) {
	if (!provider.baseUrl || !provider.apiKey) {
		throw new Error(`${provider.name} is not configured properly.`);
	}

	const client = new OpenAI({
		baseURL: provider.baseUrl,
		apiKey: provider.apiKey,
		dangerouslyAllowBrowser: true,
	});

	const chatCompletion = await client.chat.completions.create({
		model,
		messages: [{
			role: 'user',
			content: [{
				type: 'text',
				text: 'This is a test request. Simply reply: "Test passed."',
			}],
		}],
	});

	return chatCompletion;
}
