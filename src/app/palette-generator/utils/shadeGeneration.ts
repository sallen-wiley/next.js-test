/**
 * Shade Generation
 *
 * Turns a hue's locked shades into a full ramp by interpolating between them and
 * extrapolating beyond them, one HSV channel at a time.
 */

import type { HueSet, ShadeDefinition } from "../types";
import { hsvToRgb, rgbToHex } from "./colorConversions";
import { extrapolateWithFallback } from "./interpolation";

export interface GeneratedShades {
  shades: ShadeDefinition[];
  anchorUsed: boolean;
}

/**
 * Generate every unlocked shade in a ramp from the locked ones.
 * @param shades - The ramp's shades, locked and unlocked, in light-to-dark order
 * @param mode - Extrapolation mode
 * @returns The regenerated ramp, or null if nothing is locked to generate from
 */
export const generateShadeColors = (
  shades: ShadeDefinition[],
  mode: HueSet["extrapolationMode"],
): GeneratedShades | null => {
  const lockedShades = shades
    .map((shade, index) => ({ ...shade, index }))
    .filter((shade) => shade.locked);

  if (lockedShades.length === 0) return null;

  const allIndices = shades.map((_, i) => i);

  // HUE: Only use saturated colors (ignore achromatic shades)
  const hPoints = lockedShades
    .filter((s) => s.selectedForH && s.hsv.s > 1)
    .map((s) => ({
      x: s.index,
      y: s.hsv.h,
      chroma: (s.hsv.s * s.hsv.v) / 10000,
    }));

  // If no saturated points, find first saturated shade or default to 0
  const defaultHue = lockedShades.find((s) => s.hsv.s > 1)?.hsv.h ?? 0;

  // SATURATION & VALUE: Use all locked shades (including achromatic)
  const sPoints = lockedShades
    .filter((s) => s.selectedForS)
    .map((s) => ({ x: s.index, y: s.hsv.s }));
  const vPoints = lockedShades
    .filter((s) => s.selectedForV)
    .map((s) => ({ x: s.index, y: s.hsv.v }));

  const hResult =
    hPoints.length > 0
      ? extrapolateWithFallback(hPoints, allIndices, "h", allIndices, mode)
      : { values: allIndices.map(() => defaultHue), anchorUsed: false };

  const sResult =
    sPoints.length > 0
      ? extrapolateWithFallback(sPoints, allIndices, "s", allIndices, mode)
      : { values: allIndices.map(() => 50), anchorUsed: false };

  const vResult =
    vPoints.length > 0
      ? extrapolateWithFallback(vPoints, allIndices, "v", allIndices, mode)
      : { values: allIndices.map(() => 50), anchorUsed: false };

  const anchorUsed =
    hResult.anchorUsed || sResult.anchorUsed || vResult.anchorUsed;

  const minLocked = Math.min(...lockedShades.map((s) => s.index));
  const maxLocked = Math.max(...lockedShades.map((s) => s.index));

  const generated = shades.map((shade, i) => {
    if (shade.locked) return shade;

    const h = ((hResult.values[i] % 360) + 360) % 360;
    const s = Math.max(0, Math.min(100, sResult.values[i]));
    const v = Math.max(0, Math.min(100, vResult.values[i]));

    const rgb = hsvToRgb(h, s, v);

    let extrapolationMethod: "interpolated" | "linear" | "adjusted";
    if (i >= minLocked && i <= maxLocked) {
      extrapolationMethod = "interpolated";
    } else if (anchorUsed) {
      extrapolationMethod = "adjusted";
    } else {
      extrapolationMethod = "linear";
    }

    return {
      ...shade,
      hsv: { h, s, v },
      color: rgbToHex(rgb.r, rgb.g, rgb.b),
      extrapolationMethod,
      generationMode: mode,
    };
  });

  return { shades: generated, anchorUsed };
};
