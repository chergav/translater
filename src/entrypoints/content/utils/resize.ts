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
	/** node to apply cursor styles */
	handleElem?: HTMLElement
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

		const handleTarget = options.handleElem ?? node;
		const ownerDoc = node.ownerDocument;

		const cursorTarget: HTMLElement =
			(cursorContainer ? ownerDoc.querySelector<HTMLElement>(cursorContainer) : node)
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
			const r = handleTarget.getBoundingClientRect();
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

			if (e.target !== handleTarget) {
				handleTarget.style.cursor = '';
				// handleTarget.style.outline = '';
				return;
			}

			const dir = getDirection(e);
			handleTarget.style.cursor = dir ? CURSOR_MAP[dir] : '';
			// handleTarget.style.outline = '6px solid green';
			// handleTarget.style.outlineOffset = '-6px';
		}

		function handlePointerDown(e: PointerEvent): void {
			if (e.target instanceof HTMLElement && e.target !== handleTarget) return;

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

			handleTarget.setPointerCapture(e.pointerId);
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

		handleTarget.addEventListener('pointermove', handlePointerMove);
		handleTarget.addEventListener('pointerdown', handlePointerDown);
		handleTarget.addEventListener('pointerup', handlePointerUp);

		return () => {
			handleTarget.removeEventListener('pointermove', handlePointerMove);
			handleTarget.removeEventListener('pointerdown', handlePointerDown);
			handleTarget.removeEventListener('pointerup', handlePointerUp);
		};
	};
}
