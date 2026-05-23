export function stripTags(html: string): string {
	const el = document.createElement('div');
	el.innerHTML = html;
	return el.textContent ?? '';
}
