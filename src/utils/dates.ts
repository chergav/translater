const MS_PER_DAY = 24 * 60 * 60 * 1_000;
const locale = browser.i18n.getUILanguage();

const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
const dtf = new Intl.DateTimeFormat(locale, {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
});

function getTodayMidnight(): number {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

export function getRelativeDate(ts: number): string {
	const date = new Date(ts);
	const dateMid = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
	const diffDays = Math.round((dateMid - getTodayMidnight()) / MS_PER_DAY);

	if (Math.abs(diffDays) <= 1) {
		return rtf.format(diffDays, 'day');
	}

	return dtf.format(date);
}
