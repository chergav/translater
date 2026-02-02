interface BrowserInfo {
	os: string;
	browser: string;
	version: string;
}

export function getBrowserAndOS(): BrowserInfo {
	if ('userAgentData' in navigator && navigator.userAgentData) {
		const uaData = navigator.userAgentData;

		const os = uaData.platform || '';

		let brand = uaData.brands?.find(b => !b.brand.includes('Not') && b.brand !== 'Chromium');

		if (!brand) {
			brand = uaData.brands?.find(b => b.brand === 'Chromium');
		}

		const browser = brand?.brand || '';
		const version = brand?.version || '';

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
