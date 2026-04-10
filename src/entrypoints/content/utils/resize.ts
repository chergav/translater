import type { Attachment } from 'svelte/attachments';

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export interface ResizeEvent {
	direction: ResizeDirection;
	/** Delta from drag start, px */
	dx: number;
	dy: number;
	/** Current element size */
	width: number;
	height: number;
	/** Current element position via style.left / style.top */
	x: number;
	y: number;
}

export interface ResizeOptions {
	/** Hit zone thickness in px (default: 8) */
	margin?: number;
	minWidth?: number;
	minHeight?: number;
	/**
	 * CSS selector for the element whose cursor is overridden during drag.
	 * Resolved against ownerDocument. Falls back to document.body if omitted
	 * or selector matches nothing.
	 */
	cursorContainer?: string;
	onStart?: (e: ResizeEvent) => void;
	onMove?: (e: ResizeEvent) => void;
	onEnd?: (e: ResizeEvent) => void;
}

// 4 bidirectional cursors — symmetric pairs share one value
const CURSOR_MAP: Record<ResizeDirection, string> = {
	n: 'ns-resize',
	s: 'ns-resize',
	e: 'ew-resize',
	w: 'ew-resize',
	ne: 'nesw-resize',
	sw: 'nesw-resize',
	nw: 'nwse-resize',
	se: 'nwse-resize',
};

export function resize(options: ResizeOptions = {}): Attachment<HTMLElement> {
	return node => {
		const {
			margin = 8,
			minWidth = 40,
			minHeight = 40,
			cursorContainer,
			onStart,
			onMove,
			onEnd,
		} = options;

		const ownerDoc = node.ownerDocument;

		const cursorTarget: HTMLElement =
			(cursorContainer ? ownerDoc.querySelector<HTMLElement>(cursorContainer) : null)
			?? ownerDoc.body;

		let dragging = false;
		let direction: ResizeDirection | null = null;
		let startMouse = {
			x: 0,
			y: 0,
		};
		let startBox = {
			left: 0,
			top: 0,
			width: 0,
			height: 0,
		};

		function getDirection(e: PointerEvent): ResizeDirection | null {
			const r = node.getBoundingClientRect();
			const dxR = r.right - e.clientX;
			const dxL = e.clientX - r.left;
			const dyB = r.bottom - e.clientY;
			const dyT = e.clientY - r.top;

			let ns = '', ew = '';
			if (dyT < margin) ns = 'n';
			else if (dyB < margin) ns = 's';
			if (dxL < margin) ew = 'w';
			else if (dxR < margin) ew = 'e';

			if (!ns && !ew) return null;
			return (ns + ew) as ResizeDirection;
		}

		/**
		 * Returns true if the click came from a child element that overflows
		 * outside node's bounds (e.g. an open dropdown rendered via overflow:visible).
		 *
		 * These children are DOM-inside node but visually outside — the user is
		 * clicking on the dropdown UI, not on the resize border.
		 */
		function isOverflowingChildClick(e: PointerEvent): boolean {
			const target = e.target;
			if (!(target instanceof HTMLElement) || target === node) return false;
			if (!node.contains(target)) return false;

			const nodeRect = node.getBoundingClientRect();
			const targetRect = target.getBoundingClientRect();

			// Check if the click point is outside the node rect but inside the target rect —
			// meaning the user clicked on the part of the child that overflows the node
			const clickX = e.clientX, clickY = e.clientY;
			const clickOutsideNode =
				clickX < nodeRect.left ||
				clickX > nodeRect.right ||
				clickY < nodeRect.top ||
				clickY > nodeRect.bottom;

			const clickInsideTarget =
				clickX >= targetRect.left &&
				clickX <= targetRect.right &&
				clickY >= targetRect.top &&
				clickY <= targetRect.bottom;

			return clickOutsideNode && clickInsideTarget;
		}

		function buildEvent(dx: number, dy: number): ResizeEvent {
			return {
				direction: direction!,
				dx,
				dy,
				width: node.offsetWidth,
				height: node.offsetHeight,
				x: parseFloat(node.style.left) || 0,
				y: parseFloat(node.style.top) || 0,
			};
		}

		function applyResize(dx: number, dy: number): void {
			const dir = direction!;
			let { left, top, width, height } = startBox;

			const docEl = ownerDoc.documentElement;
			const maxRight = docEl.clientWidth;
			const maxBottom = docEl.clientHeight;

			if (dir.includes('e')) {
				width = Math.max(minWidth, width + dx);
				width = Math.min(width, maxRight - left);
			}
			if (dir.includes('s')) {
				height = Math.max(minHeight, height + dy);
				height = Math.min(height, maxBottom - top);
			}
			if (dir.includes('w')) {
				const newW = Math.max(minWidth, width - dx);
				const clampedLeft = Math.max(0, left + (width - newW));
				width = (left + width) - clampedLeft;
				left = clampedLeft;
			}
			if (dir.includes('n')) {
				const newH = Math.max(minHeight, height - dy);
				const clampedTop = Math.max(0, top + (height - newH));
				height = (top + height) - clampedTop;
				top = clampedTop;
			}

			node.style.left = `${left}px`;
			node.style.top = `${top}px`;
			node.style.width = `${width}px`;
			node.style.height = `${height}px`;
		}

		function handlePointerMove(e: PointerEvent): void {
			if (dragging) {
				const dx = e.clientX - startMouse.x;
				const dy = e.clientY - startMouse.y;
				applyResize(dx, dy);
				onMove?.(buildEvent(dx, dy));
				return;
			}
			const dir = getDirection(e);
			node.style.cursor = dir ? CURSOR_MAP[dir] : '';
		}

		function handlePointerDown(e: PointerEvent): void {
			// Click landed on a child that visually overflows outside node bounds
			// (e.g. an open dropdown) — don't intercept, let it select normally
			if (isOverflowingChildClick(e)) return;

			const dir = getDirection(e);
			if (!dir) return;

			direction = dir;
			dragging = true;
			startMouse = {
				x: e.clientX,
				y: e.clientY,
			};

			startBox = {
				left: parseFloat(node.style.left) || 0,
				top: parseFloat(node.style.top) || 0,
				width: node.offsetWidth,
				height: node.offsetHeight,
			};

			node.setPointerCapture(e.pointerId);
			cursorTarget.style.cursor = CURSOR_MAP[dir];

			onStart?.(buildEvent(0, 0));
		}

		function handlePointerUp(e: PointerEvent): void {
			if (!dragging) return;
			dragging = false;
			cursorTarget.style.cursor = '';
			onEnd?.(buildEvent(e.clientX - startMouse.x, e.clientY - startMouse.y));
			direction = null;
		}

		node.addEventListener('pointermove', handlePointerMove);
		node.addEventListener('pointerdown', handlePointerDown);
		node.addEventListener('pointerup', handlePointerUp);

		return () => {
			node.removeEventListener('pointermove', handlePointerMove);
			node.removeEventListener('pointerdown', handlePointerDown);
			node.removeEventListener('pointerup', handlePointerUp);
		};
	};
}
