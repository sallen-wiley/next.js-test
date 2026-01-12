/**
 * Color Conversion Utilities
 *
 * Functions for converting between HSV, RGB, and Hex color formats.
 */

import type { HSV, RGB } from "../types";

// ============================================================================
// HSV <-> RGB CONVERSIONS
// ============================================================================

/**
 * Convert HSV to RGB
 * @param h - Hue (0-360 degrees)
 * @param s - Saturation (0-100 percent)
 * @param v - Value/Brightness (0-100 percent)
 * @returns RGB object with r, g, b values (0-255)
 */
export const hsvToRgb = (h: number, s: number, v: number): RGB => {
  s = s / 100;
  v = v / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
};

/**
 * Convert RGB to HSV
 * @param r - Red (0-255)
 * @param g - Green (0-255)
 * @param b - Blue (0-255)
 * @returns HSV object with h (0-360), s (0-100), v (0-100)
 */
export const rgbToHsv = (r: number, g: number, b: number): HSV => {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }
  }
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : (delta / max) * 100;
  const v = max * 100;

  return { h, s, v };
};

// ============================================================================
// HEX <-> RGB CONVERSIONS
// ============================================================================

/**
 * Convert hex color to RGB
 * @param hex - Hex color string (e.g., "#FF5733")
 * @returns RGB object with r, g, b values (0-255)
 */
export const hexToRgb = (hex: string): RGB => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

/**
 * Convert RGB to hex color
 * @param r - Red (0-255)
 * @param g - Green (0-255)
 * @param b - Blue (0-255)
 * @returns Hex color string (e.g., "#FF5733")
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.padStart(2, "0");
      })
      .join("")
  );
};

// ============================================================================
// HEX <-> HSV CONVERSIONS
// ============================================================================

/**
 * Convert hex color to HSV
 * @param hex - Hex color string (e.g., "#FF5733")
 * @returns HSV object with h (0-360), s (0-100), v (0-100)
 */
export const hexToHsv = (hex: string): HSV => {
  const rgb = hexToRgb(hex);
  return rgbToHsv(rgb.r, rgb.g, rgb.b);
};
