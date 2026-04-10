class PopupStore {
	public dragging = $state<boolean>(false);
	public resizing = $state<boolean>(false);
}

export const popupStore = new PopupStore();
