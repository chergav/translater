/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly MOCK: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
