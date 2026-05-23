import type { MenuAlign } from '../types';

export const alignClasses: Record<MenuAlign, string> = {
	start: 'left-0',
	end: 'right-0',
	center: 'left-1/2 -translate-x-1/2',
};
