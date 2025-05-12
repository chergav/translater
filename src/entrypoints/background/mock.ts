export const mock = {
	'sentences': [
		{
			'trans': 'настраивать.\n',
			'orig': 'set up.\n',
			'backend': 10,
			'translation_engine_debug_info': [
				{
					'has_untranslatable_chunk': true,
				},
			],
		},
		{
			'trans': 'составить',
			'orig': 'make up',
			'backend': 12,
		},
		{
			'translit': 'nastraivat\'.\nsostavit\'',
		},
	],
	'src': 'en',
	'alternative_translations': [
		{
			'src_phrase': 'set up.',
			'alternative': [
				{
					'word_postproc': 'настраивать.',
					'has_preceding_space': true,
					'attach_to_next_token': false,
					'backends': [
						10,
					],
				},
				{
					'word_postproc': 'настроить.',
					'has_preceding_space': true,
					'attach_to_next_token': false,
					'backends': [
						10,
					],
				},
				{
					'word_postproc': 'настройка.',
					'has_preceding_space': true,
					'attach_to_next_token': false,
					'backends': [
						3,
					],
					'backend_infos': [
						{
							'backend': 3,
						},
					],
				},
			],
			'srcunicodeoffsets': [
				{
					'begin': 0,
					'end': 7,
				},
			],
			'raw_src_segment': 'set up.',
			'start_pos': 0,
			'end_pos': 0,
		},
		{
			'src_phrase': '\n',
			'srcunicodeoffsets': [
				{
					'begin': 0,
					'end': 1,
				},
			],
			'raw_src_segment': '\n',
			'start_pos': 0,
			'end_pos': 0,
		},
		{
			'src_phrase': 'make up',
			'alternative': [
				{
					'word_postproc': 'составить',
					'has_preceding_space': true,
					'attach_to_next_token': false,
					'backends': [
						12,
					],
				},
				{
					'word_postproc': 'макияж, мириться',
					'has_preceding_space': true,
					'attach_to_next_token': false,
					'backends': [
						10,
					],
				},
				{
					'word_postproc': 'макияж',
					'has_preceding_space': true,
					'attach_to_next_token': false,
					'backends': [
						3,
					],
					'backend_infos': [
						{
							'backend': 3,
						},
					],
				},
				{
					'word_postproc': 'мамин',
					'has_preceding_space': true,
					'attach_to_next_token': false,
					'backends': [
						8,
					],
				},
			],
			'srcunicodeoffsets': [
				{
					'begin': 0,
					'end': 7,
				},
			],
			'raw_src_segment': 'make up',
			'start_pos': 0,
			'end_pos': 0,
		},
	],
	'confidence': 1,
	'spell': {},
	'ld_result': {
		'srclangs': [
			'en',
		],
		'srclangs_confidences': [
			1,
		],
		'extended_srclangs': [
			'en',
		],
	},
};
