import type { HistoryItem } from '~/types';
import { getDisplayedLanguageName } from '~/shared/languages';

const SEPARATOR = '\n\n---\n\n';

export function historyItemToString(
	historyItem: HistoryItem,
	format: 'text' | 'markdown' = 'text',
	indent: string = '',
): string {
	const date = new Date(historyItem.time).toLocaleString();
	const from = getDisplayedLanguageName(historyItem.sourceLang, 'name+code');
	const to = getDisplayedLanguageName(historyItem.targetLang, 'name+code');

	const isMarkdown = format === 'markdown';
	const bold = isMarkdown ? '**' : '';

	const lines = [
		`${bold}${browser.i18n.getMessage('options_history_exp_date')}:${bold} ${date}`,
		`${bold}${browser.i18n.getMessage('options_history_exp_direction')}:${bold} ${from} → ${to}`,
		`${bold}${browser.i18n.getMessage('options_history_exp_original')}:${bold} ${historyItem.orig}`,
		`${bold}${browser.i18n.getMessage('options_history_exp_translation')}:${bold} ${historyItem.trans}`,
	];

	return lines.map(line => `${indent}${line}`).join('\n');
}

export function allHistoryItemToString(
	historyItems: HistoryItem[],
	format: 'text' | 'markdown' = 'text',
): string {
	const historyArray = historyItems.map(i => historyItemToString(i, format));

	return historyArray.join(SEPARATOR) + '\n';
}
