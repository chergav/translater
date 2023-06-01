module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			keyframes: {
				circle_grow: {
					'0%': { transform: 'scale(0)' },
					'100%': { transform: 'scale(1)' }
				}
			},
			animation: {
				circle_grow: 'circle_grow 300ms cubic-bezier(0.05, 0.7, 0.1, 1) 0s 1 normal none running'
			}
		},
		fontSize: {
			xs: ['12px', '16px'],
			sm: ['14px', '20px'],
			base: ['16px', '24px'],
			lg: ['20px', '28px'],
			xl: ['24px', '32px']
		},
		spacing: {
			'px': '1px',
			'0': '0px',
			'.5': '2px',
			'1': '4px',
			'1.5': '6px',
			'2': '8px',
			'3': '12px',
			'4': '16px',
			'5': '20px',
			'6': '24px',
			'7': '28px',
			'8': '32px',

			'64': '256px',
			'72': '288px',
			'80': '320px',
			'96': '384px'
		},
		borderRadius: {
			'sm': '2px',
			DEFAULT: '4px',
			'md': '6px',
			'lg': '8px',
			'xl': '12px',
			'full': '9999px'
		}
	},
	plugins: [require('@tailwindcss/forms')],
	darkMode: 'class'
};
