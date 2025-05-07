const MS_PER_DAY = 24 * 60 * 60 * 1_000;
const locale = browser.i18n.getUILanguage();
const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

export function getRelativeDate(dateString: string): string {
	const [year, month, day] = dateString.split('-').map(Number);
	const date = new Date(year, month - 1, day);
	const now = new Date();
	const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
	const diffDays = Math.ceil((date.getTime() - todayMid) / MS_PER_DAY);

	if (Math.abs(diffDays) <= 1) {
		return rtf.format(diffDays, 'day');
	}

	const opts: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	};

	return date.toLocaleDateString(locale, opts);
}

export function formatDate(ts: number): string {
	return new Date(ts).toISOString().split('T')[0];
}
