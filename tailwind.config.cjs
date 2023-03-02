module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {},
		fontSize: {
			xs: ['12px', '16px'],
			sm: ['14px', '20px'],
			base: ['16px', '24px'],
			lg: ['20px', '28px'],
			xl: ['24px', '32px']
		},
		spacing: {
			'0': '0px',
			'1': '4px',
			'1.5': '6px',
			'2': '8px',
			'3': '12px',
			'4': '16px',
			'5': '20px',
			'6': '24px',
			'7': '28px',
			'8': '32px',

			'96': '384px'
		}
	},
	plugins: [require('@tailwindcss/forms')],
	darkMode: 'class'
};
