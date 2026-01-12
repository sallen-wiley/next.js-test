/**
 * Default Values and Constants
 *
 * Default palette configurations, color values, and migration utilities.
 */

import type { HueSet, ShadeConfiguration } from "../types";
import { hexToHsv } from "./colorConversions";

// ============================================================================
// DEFAULT SHADE CONFIGURATION
// ============================================================================

export const DEFAULT_SHADE_CONFIG: ShadeConfiguration[] = [
  { id: "1", label: "50" },
  { id: "2", label: "100" },
  { id: "3", label: "200" },
  { id: "4", label: "300" },
  { id: "5", label: "400" },
  { id: "6", label: "500" },
  { id: "7", label: "600" },
  { id: "8", label: "700" },
  { id: "9", label: "800" },
  { id: "10", label: "900" },
];

// ============================================================================
// DEFAULT PALETTE COLORS
// ============================================================================

export const DEFAULT_PALETTE_COLORS: Record<number, string> = {
  50: "#f5fafa",
  100: "#dfeef0",
  200: "#c3dfe2",
  300: "#a6ced1",
  400: "#87b9be",
  500: "#68a3a8",
  600: "#45848a",
  700: "#245e64",
  800: "#0d383d",
  900: "#02181a",
};

// ============================================================================
// MUI PALETTE KEYS
// ============================================================================

export const MUI_PALETTE_KEYS = [
  "red",
  "pink",
  "purple",
  "deepPurple",
  "indigo",
  "blue",
  "lightBlue",
  "cyan",
  "teal",
  "green",
  "lightGreen",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deepOrange",
  "brown",
  "grey",
  "blueGrey",
] as const;

// ============================================================================
// DEFAULT HUE SET
// ============================================================================

export const DEFAULT_HUE: HueSet = {
  id: "1",
  name: "primary",
  muiName: "primary",
  extrapolationMode: "functional",
  shadeConfig: DEFAULT_SHADE_CONFIG,
  shades: DEFAULT_SHADE_CONFIG.map((config) => {
    const color = DEFAULT_PALETTE_COLORS[Number(config.label)] || "#808080";
    const hsv = hexToHsv(color);
    return {
      id: `shade-${config.id}`,
      label: config.label,
      color,
      locked: false,
      hsv,
      selectedForH: true,
      selectedForS: true,
      selectedForV: true,
    };
  }),
};

// ============================================================================
// MIGRATION UTILITIES
// ============================================================================

/**
 * Migrate old palette format to current format
 * Handles palettes that may have been saved with .value property on shades
 * @param hue - HueSet to migrate
 * @returns Migrated HueSet
 */
export const migrateHueSet = (hue: HueSet): HueSet => {
  // If already has shadeConfig, no migration needed
  if (hue.shadeConfig) {
    return hue;
  }

  // Migrate from old format (shades with .value) to new format (shadeConfig)
  const shadeConfig = hue.shades.map((shade, index) => ({
    id: String(index + 1),
    // @ts-expect-error - old format might have .value property
    label: String(shade.value || (index + 1) * 100),
  }));

  return {
    ...hue,
    shadeConfig,
    shades: hue.shades.map((shade, index) => ({
      ...shade,
      // @ts-expect-error - old format might have .value property
      label: String(shade.value || (index + 1) * 100),
    })),
  };
};
