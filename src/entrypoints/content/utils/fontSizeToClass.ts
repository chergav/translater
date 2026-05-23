export const fontSizeToClassMap: Record<number, string> = {
	12: 'text-xs',
	14: 'text-sm',
	16: 'text-base',
	18: 'text-lg',
	20: 'text-xl',
};

export function getFontClass(size: number): string {
	return fontSizeToClassMap[size] || 'text-base';
}
