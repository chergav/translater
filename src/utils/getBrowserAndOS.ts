interface BrowserInfo {
	os: string;
	browser: string;
	version: string;
}

export function getBrowserAndOS(): BrowserInfo {
	if ('userAgentData' in navigator && navigator.userAgentData) {
		const uaData = navigator.userAgentData;

		const os = uaData.platform || '';
		const browser = uaData.brands?.[0]?.brand || '';
		const version = uaData.brands?.[0]?.version || '';

		return {
			os,
			browser,
			version,
		};
	}

	return {
		os: navigator.platform || '',
		browser: navigator.userAgent || '',
		version: '',
	};
}
