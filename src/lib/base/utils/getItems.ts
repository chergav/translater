export function getItems(
	containerRef:HTMLElement | null,
	roleSelector: string,
): HTMLElement[] {
	return Array.from(
		containerRef?.querySelectorAll(`[role="${roleSelector}"]:not([aria-disabled])`) ?? [],
	);
}
