<svg
	class={icon({
		size,
		class: className,
	})}
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<path {d} />
</svg>

<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants';

const icon = tv({
	base: 'fill-current',
	variants: {
		size: {
			'16': 'size-4',
			'18': 'size-[18px]',
			'20': 'size-5',
			'24': 'size-6',
			'28': 'size-7',
			'32': 'size-8',
			'36': 'size-9',
			'40': 'size-10',
			'44': 'size-11',
			'48': 'size-12',
			'128': 'size-32',
		},
	},
	defaultVariants: {
		size: '24',
	},
});

interface Props {
	d: string
	size?: VariantProps<typeof icon>['size']
	class?: string
}

let {
	d,
	size = '24',
	class: className,
}: Props = $props();
</script>
