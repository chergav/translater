export interface Translated extends GoogleTranslate {
	sentence: Sentence
	sourceLang: string
	targetLang: string
}

export interface GoogleTranslate {
	sentences: Sentence[]
	dict: Dict[]
	src: string
	alternative_translations: AlternativeTranslation[]
	confidence: number
	spell: Spell
	ld_result: LdResult
	synsets: Synset[]
	definitions: Definition[]
	examples: Examples
}

export interface Sentence {
	trans?: string
	orig?: string
	backend?: number
	translit?: string
	src_translit?: string
}

export interface Dict {
	pos: string
	terms: string[]
	entry: Entry[]
	base_form: string
	pos_enum: number
}

export interface Entry {
	word: string
	reverse_translation: string[]
	score: number
}

export interface AlternativeTranslation {
	src_phrase: string
	alternative?: Alternative[]
	srcunicodeoffsets: Srcunicodeoffset[]
	raw_src_segment: string
	start_pos: number
	end_pos: number
}

export interface Alternative {
	word_postproc: string
	has_preceding_space: boolean
	attach_to_next_token: boolean
	backends: number[]
	backend_infos?: BackendInfo[]
}

export interface BackendInfo {
	backend: number
}

export interface Srcunicodeoffset {
	begin: number
	end: number
}

export interface Spell {
	spell_html_res: string
	spell_res: string
	correction_type: number[]
}

export interface LdResult {
	srclangs: string[]
	srclangs_confidences: number[]
	extended_srclangs: string[]
}

export interface Synset {
	pos: string
	entry: Entry2[]
	base_form: string
	pos_enum: number
}

export interface Entry2 {
	synonym: string[]
	definition_id: string
	label_info?: LabelInfo
}

export interface Definition {
	pos: string
	entry: Entry3[]
	base_form: string
	pos_enum: number
}

export interface Entry3 {
	gloss: string
	definition_id: string
	example?: string
	label_info?: LabelInfo
	synsets: Entry2[]
}

export interface LabelInfo {
	register: string[]
	subject: string[]
}

export interface Examples {
	example: Example[]
}

export interface Example {
	text: string
	definition_id: string
}
