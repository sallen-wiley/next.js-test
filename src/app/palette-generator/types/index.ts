/**
 * Type definitions for HSV Palette Generator
 *
 * Core interfaces for color management, shade configuration,
 * and component props used throughout the palette generator.
 */

// ============================================================================
// COLOR MODELS
// ============================================================================

export interface HSV {
  h: number; // 0-360 degrees
  s: number; // 0-100 percent
  v: number; // 0-100 percent
}

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

// ============================================================================
// PALETTE CONFIGURATION
// ============================================================================

export interface ShadeConfiguration {
  id: string; // "1", "2", "3"... (sequential IDs)
  label: string; // "50", "100" or "Lightest", "Base" etc. (user editable)
}

export interface ShadeDefinition {
  id: string;
  label: string; // Display label: "50", "Lightest", etc.
  color: string; // hex format: #RRGGBB
  locked: boolean;
  hsv: HSV;
  selectedForH: boolean;
  selectedForS: boolean;
  selectedForV: boolean;
  extrapolationMethod?: "interpolated" | "linear" | "adjusted";
  generationMode?: "functional" | "functional-saturated" | "expressive"; // Mode used when generating this shade
}

export interface HueSet {
  id: string;
  name: string; // Display name
  muiName: string; // MUI palette key (primary, secondary, etc.)
  shades: ShadeDefinition[];
  extrapolationMode: "functional" | "functional-saturated" | "expressive";
  shadeConfig: ShadeConfiguration[]; // Shade count and labels configuration
}

// ============================================================================
// INTERPOLATION
// ============================================================================

export interface InterpolationPoint {
  x: number;
  y: number;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface HueEditorProps {
  hue: HueSet;
  onUpdate: (
    updates: Partial<HueSet> | ((current: HueSet) => Partial<HueSet>),
  ) => void;
  onRemove: () => void;
  canRemove: boolean;
  contrastTargetColor?: string | null;
}

export interface ShadeGridProps {
  shades: ShadeDefinition[];
  onShadeUpdate: (shadeId: string, updates: Partial<ShadeDefinition>) => void;
}

export interface ShadeCardProps {
  shade: ShadeDefinition;
  onUpdate: (updates: Partial<ShadeDefinition>) => void;
}
