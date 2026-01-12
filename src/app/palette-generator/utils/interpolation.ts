/**
 * Interpolation and Extrapolation Utilities
 *
 * Functions for generating color shades using spline interpolation
 * and extrapolation with various modes (functional, expressive, etc.)
 */

import type { InterpolationPoint } from "../types";

// ============================================================================
// SPLINE INTERPOLATION
// ============================================================================

/**
 * Catmull-Rom spline interpolation for smooth curves
 * @param points - Array of control points { x, y }
 * @param targetIndices - Array of x-values to interpolate
 * @returns Array of interpolated y-values
 */
export const splineInterpolation = (
  points: InterpolationPoint[],
  targetIndices: number[]
): number[] => {
  if (points.length === 0) return targetIndices.map(() => 50);
  if (points.length === 1) return targetIndices.map(() => points[0].y);

  points.sort((a: InterpolationPoint, b: InterpolationPoint) => a.x - b.x);

  return targetIndices.map((idx: number) => {
    if (idx <= points[0].x) return points[0].y;
    if (idx >= points[points.length - 1].x) return points[points.length - 1].y;

    let i = 0;
    while (i < points.length - 1 && points[i + 1].x < idx) i++;

    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[Math.min(points.length - 1, i + 1)];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const t = (idx - p1.x) / (p2.x - p1.x);

    const v0 = p0.y;
    const v1 = p1.y;
    const v2 = p2.y;
    const v3 = p3.y;

    const t2 = t * t;
    const t3 = t2 * t;

    return (
      0.5 *
      (2 * v1 +
        (-v0 + v2) * t +
        (2 * v0 - 5 * v1 + 4 * v2 - v3) * t2 +
        (-v0 + 3 * v1 - 3 * v2 + v3) * t3)
    );
  });
};

// ============================================================================
// LINEAR EXTRAPOLATION
// ============================================================================

/**
 * Linear extrapolation beyond control points
 * @param points - Array of control points { x, y }
 * @param targetIndices - Array of x-values to interpolate/extrapolate
 * @returns Array of interpolated/extrapolated y-values
 */
export const extrapolateLinear = (
  points: InterpolationPoint[],
  targetIndices: number[]
): number[] => {
  points.sort((a, b) => a.x - b.x);

  return targetIndices.map((idx) => {
    // Within range: use spline interpolation
    if (idx >= points[0].x && idx <= points[points.length - 1].x) {
      return splineInterpolation(points, [idx])[0];
    }

    // LEFT extrapolation (lighter shades)
    if (idx < points[0].x) {
      if (points.length === 1) return points[0].y;
      const p0 = points[0];
      const p1 = points[1];
      const slope = (p1.y - p0.y) / (p1.x - p0.x);
      return p0.y + slope * (idx - p0.x);
    }

    // RIGHT extrapolation (darker shades)
    if (idx > points[points.length - 1].x) {
      if (points.length === 1) return points[0].y;
      const p1 = points[points.length - 2];
      const p2 = points[points.length - 1];
      const slope = (p2.y - p1.y) / (p2.x - p1.x);
      return p2.y + slope * (idx - p2.x);
    }

    return 0; // Fallback
  });
};

// ============================================================================
// ANCHOR-BASED EXTRAPOLATION
// ============================================================================

/**
 * Extrapolate with virtual anchor points for white/black
 * @param points - Array of control points { x, y }
 * @param targetIndices - Array of x-values to interpolate/extrapolate
 * @param channel - Color channel: 'h', 's', or 'v'
 * @param shadeCount - Array of shade indices
 * @param mode - Extrapolation mode: functional, functional-saturated, or expressive
 * @returns Array of interpolated/extrapolated y-values
 */
export const extrapolateWithAnchors = (
  points: InterpolationPoint[],
  targetIndices: number[],
  channel: "h" | "s" | "v",
  shadeCount: number[],
  mode: "functional" | "functional-saturated" | "expressive"
): number[] => {
  // Calculate virtual indices for pure white and pure black anchors
  // These are positioned just outside the actual shade range
  const whiteIndex = -0.5; // Just before first shade (lighter than lightest)
  const blackIndex = shadeCount.length - 0.5; // Just after last shade (darker than darkest)

  const extendedPoints = [...points];
  const minLockedIndex = points[0].x;
  const maxLockedIndex = points[points.length - 1].x;

  // Add anchors based on channel
  if (channel === "h") {
    // Hue: keep constant at edge values
    if (minLockedIndex > 0) {
      extendedPoints.unshift({ x: whiteIndex, y: points[0].y });
    }
    if (maxLockedIndex < shadeCount.length - 1) {
      extendedPoints.push({ x: blackIndex, y: points[points.length - 1].y });
    }
  } else if (channel === "s") {
    // Saturation: white always has no saturation, dark end depends on mode
    if (minLockedIndex > 0) {
      extendedPoints.unshift({ x: whiteIndex, y: 0 }); // White anchor (light end)
    }
    if (maxLockedIndex < shadeCount.length - 1) {
      let darkS = 0; // Default to natural black

      if (mode === "functional") {
        darkS = 0; // Natural black (S=0)
      } else if (mode === "functional-saturated") {
        darkS = 100; // Rich saturated darks (S=100)
      } else if (mode === "expressive") {
        // In expressive mode, maintain last saturation level for smoother curves
        darkS = points[points.length - 1].y;
      }

      extendedPoints.push({ x: blackIndex, y: darkS });
    }
  } else if (channel === "v") {
    // Value: white is full brightness, dark end depends on mode
    if (minLockedIndex > 0) {
      extendedPoints.unshift({ x: whiteIndex, y: 100 }); // White anchor (light end)
    }
    if (maxLockedIndex < shadeCount.length - 1) {
      let darkV = 0; // Default to pure black

      if (mode === "functional" || mode === "functional-saturated") {
        darkV = 0; // Natural black (V=0) for UI elements
      } else if (mode === "expressive") {
        // In expressive mode, maintain last brightness level for smoother curves
        // This prevents aggressive black trending
        darkV = points[points.length - 1].y;
      }

      extendedPoints.push({ x: blackIndex, y: darkV });
    }
  }

  return splineInterpolation(extendedPoints, targetIndices);
};

// ============================================================================
// EXTRAPOLATION WITH FALLBACK
// ============================================================================

/**
 * Extrapolate with automatic fallback to anchors when out of bounds
 * @param points - Array of control points { x, y }
 * @param targetIndices - Array of x-values to interpolate/extrapolate
 * @param channel - Color channel: 'h', 's', or 'v'
 * @param shadeCount - Array of shade indices
 * @param mode - Extrapolation mode
 * @returns Object with extrapolated values and whether anchors were used
 */
export const extrapolateWithFallback = (
  points: InterpolationPoint[],
  targetIndices: number[],
  channel: "h" | "s" | "v",
  shadeCount: number[],
  mode: "functional" | "functional-saturated" | "expressive"
): { values: number[]; anchorUsed: boolean } => {
  // Special handling for hue (always constant for monochromatic palettes)
  if (channel === "h") {
    // For hue, use linear extrapolation in both modes (hue should be constant)
    const extrapolated = extrapolateLinear(points, targetIndices);
    return { values: extrapolated, anchorUsed: false };
  }

  // FUNCTIONAL MODES: Always use anchors for S and V
  if (mode === "functional" || mode === "functional-saturated") {
    const anchored = extrapolateWithAnchors(
      points,
      targetIndices,
      channel,
      shadeCount,
      mode
    );
    return { values: anchored, anchorUsed: true };
  }

  // EXPRESSIVE MODE: Use linear extrapolation with clamping
  if (mode === "expressive") {
    // Step 1: Always use linear extrapolation for natural curve
    const extrapolated = extrapolateLinear(points, targetIndices);

    // Step 2: Clamp invalid values to valid range while preserving trajectory
    const clampedValues = extrapolated.map((value) => {
      // Clamp S and V to 0-100 (hue already handled above)
      return Math.max(0, Math.min(100, value));
    });

    return { values: clampedValues, anchorUsed: false };
  }

  // Fallback (should never reach here)
  return { values: targetIndices.map(() => 50), anchorUsed: false };
};
