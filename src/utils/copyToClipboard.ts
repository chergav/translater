export async function copyToClipboard(text: string): Promise<void> {
	try {
		await navigator.clipboard.writeText(text);
	} catch (error) {
		throw new Error('Failed to copy to clipboard', { cause: error });
	}
}
