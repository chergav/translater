import type { Attachment } from 'svelte/attachments';

export interface DragEvent {
	/** Delta from drag start, px */
	dx: number;
	dy: number;
}

export interface DragOptions {
	/** Threshold in px (default: 6) */
	threshold?: number;
	onStart?: (e: DragEvent) => void;
	onMove?: (e: DragEvent) => void;
	onEnd?: (e: DragEvent) => void;
}

export function drag(options: DragOptions = {}): Attachment<HTMLElement> {
	const { threshold = 6, onStart, onMove, onEnd } = options;

	return node => {
		let wasDragged = false;
		let dx = 0;
		let dy = 0;

		const onClick = (e: MouseEvent) => {
			if (wasDragged) {
				e.stopPropagation();
				wasDragged = false;
			}
		};

		const onPointerDown = (e: PointerEvent) => {
			if (e.button !== 0) return;

			const startPointerX = e.clientX;
			const startPointerY = e.clientY;
			const { top } = node.getBoundingClientRect();
			let moved = false;

			const handleMove = (e: PointerEvent) => {
				node.style.cursor = 'grabbing';
				dx = e.clientX - startPointerX;
				dy = Math.max(-top, e.clientY - startPointerY);

				if (!moved && Math.hypot(dx, dy) < threshold) return;

				if (!moved) {
					moved = true;
					wasDragged = true;
					onStart?.({
						dx: 0,
						dy: 0,
					});
				}

				onMove?.({
					dx,
					dy,
				});
			};

			const handleUp = () => {
				window.removeEventListener('pointermove', handleMove);
				window.removeEventListener('pointerup', handleUp);
				if (moved) onEnd?.({
					dx,
					dy,
				});
				node.style.cursor = 'grab';
			};

			window.addEventListener('pointermove', handleMove);
			window.addEventListener('pointerup', handleUp);
		};

		node.addEventListener('click', onClick, { capture: true });
		node.addEventListener('pointerdown', onPointerDown);
		node.style.cursor = 'grab';

		return () => {
			node.removeEventListener('click', onClick, { capture: true });
			node.removeEventListener('pointerdown', onPointerDown);
		};
	};
}
