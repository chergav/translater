import BezierEasing from 'bezier-easing';

/**
 * Effects (colors, opacity)
 */

/**duration 150ms */
export const effectsFast = BezierEasing(0.31, 0.94, 0.34, 1.00);

/**duration 200ms */
export const effectsDefault = BezierEasing(0.34, 0.80, 0.34, 1.00);
export const effectsDefaultCss = 'cubic-bezier(0.34, 0.80, 0.34, 1.00)';

/**duration 300ms */
export const effectsSlow = BezierEasing(0.34, 0.88, 0.34, 1.00);

/**
 * Spatial (motion)
 */

/**duration 350ms */
export const expressiveSpatialFast = BezierEasing(0.42, 1.67, 0.21, 0.90);
export const expressiveSpatialFastCss = 'cubic-bezier(0.42, 1.67, 0.21, 0.90)';

/** duration 500ms */
export const expressiveSpatialDefault = BezierEasing(0.38, 1.21, 0.22, 1.00);
export const expressiveSpatialDefaultCss = 'cubic-bezier(0.38, 1.21, 0.22, 1.00)';

/** duration 650ms */
export const expressiveSpatialSlow = BezierEasing(0.39, 1.29, 0.35, 0.98);

/** fast 350ms, default 500ms, slow 750ms */
export const standardSpatial = BezierEasing(0.27, 1.06, 0.18, 1.00);
export const standardSpatialCss = 'cubic-bezier(0.27, 1.06, 0.18, 1.00)';
