/**
 * Contrast Calculation Utilities
 *
 * Functions for calculating WCAG contrast ratios and luminance values.
 */

/**
 * Calculate relative luminance of a color
 * @param hex - Hex color string (e.g., "#FF5733")
 * @returns Relative luminance value (0-1)
 */
const getLuminance = (hex: string): number => {
  const rgb = [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ].map((val) => {
    const v = val / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};

/**
 * Calculate contrast ratio between two colors
 * @param hex1 - First hex color string
 * @param hex2 - Second hex color string
 * @returns Contrast ratio (1-21)
 */
export const calculateContrast = (hex1: string, hex2: string): number => {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};
