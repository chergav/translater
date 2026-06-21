import type { SettingsHistory, HistoryItem } from '~/types';
import deepEqual from 'fast-deep-equal';
import { getRelativeDate } from '~/utils';

interface GroupedHistory {
	[date: string]: HistoryItem[]
}

const initialSettings: SettingsHistory = {
	history: [],
};

export enum SortOrder {
	Asc = 'asc',
	Desc = 'desc',
}

class StorageHistory {
	public settings: SettingsHistory;
	public sortOrder: SortOrder = $state(SortOrder.Desc);
	public sortedHistory: HistoryItem[];
	public groupedHistory: GroupedHistory;

	public constructor(settings: SettingsHistory) {
		this.settings = $state<SettingsHistory>(settings);
		this.sortedHistory = $derived(
			this.settings.history.toSorted((a, b) =>
				this.sortOrder === SortOrder.Desc ? b.time - a.time : a.time - b.time,
			),
		);
		this.groupedHistory = $derived(
			this.sortedHistory.reduce<GroupedHistory>((acc, item) => {
				const date = getRelativeDate(item.time);
				(acc[date] ||= []).push(item);
				return acc;
			}, {}),
		);
		browser.storage.local.onChanged.addListener(this.#onStorageChange);
	}

	public delete(time: HistoryItem['time']) {
		this.settings.history = this.settings.history.filter(i => i.time !== time);
		this.#save();
	}

	public clear = () => {
		this.settings.history = [];
		this.#save();
	};

	#onStorageChange = (changes: { [key: string]: Browser.storage.StorageChange }) => {
		const stateSnapshot = $state.snapshot(this.settings);

		for (const [keyString, { newValue }] of Object.entries(changes)) {
			const key = keyString as keyof SettingsHistory;

			if (!(key in initialSettings)) continue;

			if (!deepEqual(stateSnapshot[key], newValue)) {
				Object.assign(this.settings, { [key]: newValue });
			}
		}
	};

	async #save() {
		const history = $state.snapshot(this.settings.history);
		await browser.storage.local.set<SettingsHistory>({ history });
	}

	// public destroy() {
	// 	browser.storage.local.onChanged.removeListener(this.#onStorageChange);
	// }
}

const settings = await browser.storage.local.get<SettingsHistory>(initialSettings);

export const storageHistory = new StorageHistory(settings);
