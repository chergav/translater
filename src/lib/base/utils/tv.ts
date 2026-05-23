import type { TV } from 'tailwind-variants';
import { tv as tvBase } from 'tailwind-variants';

const twMergeConfig = {
	classGroups: {
		rounded: ['rounded-20', 'rounded-28', 'rounded-48'],
		w: ['w-13', 'w-18'],
		h: ['h-13', 'h-18'],
		size: ['size-13', 'size-18'],
	},
};

export const tv: TV = (options, config) =>
	tvBase(options, {
		...config,
		twMergeConfig: {
			...config?.twMergeConfig,
			classGroups: {
				...config?.twMergeConfig?.classGroups,
				...twMergeConfig.classGroups,
			},
		},
	});
