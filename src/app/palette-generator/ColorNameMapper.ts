/**
 * Improved color name mapping using LAB color space for perceptual accuracy.
 * LAB is designed to be perceptually uniform, making it much better for color matching.
 */

interface HSV {
  h: number; // 0-360 degrees
  s: number; // 0-100 percent
  v: number; // 0-100 percent
}

interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

interface LAB {
  l: number; // 0-100 (lightness)
  a: number; // -128 to 127 (green to red)
  b: number; // -128 to 127 (blue to yellow)
}

interface NamedColor {
  name: string;
  hex: string;
  lab: LAB;
}

/**
 * Convert RGB to XYZ color space (intermediate step for LAB)
 */
function rgbToXyz(
  r: number,
  g: number,
  b: number
): { x: number; y: number; z: number } {
  // Normalize RGB values to 0-1
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ using sRGB matrix (D65 illuminant)
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

  return { x: x * 100, y: y * 100, z: z * 100 };
}

/**
 * Convert XYZ to LAB color space
 */
function xyzToLab(x: number, y: number, z: number): LAB {
  // Reference white point (D65)
  const refX = 95.047;
  const refY = 100.0;
  const refZ = 108.883;

  x = x / refX;
  y = y / refY;
  z = z / refZ;

  const epsilon = 0.008856;
  const kappa = 903.3;

  const fx = x > epsilon ? Math.pow(x, 1 / 3) : (kappa * x + 16) / 116;
  const fy = y > epsilon ? Math.pow(y, 1 / 3) : (kappa * y + 16) / 116;
  const fz = z > epsilon ? Math.pow(z, 1 / 3) : (kappa * z + 16) / 116;

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return { l, a, b };
}

/**
 * Convert RGB to LAB
 */
function rgbToLab(r: number, g: number, b: number): LAB {
  const xyz = rgbToXyz(r, g, b);
  return xyzToLab(xyz.x, xyz.y, xyz.z);
}

/**
 * Convert hex to LAB
 */
function hexToLab(hex: string): LAB {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return rgbToLab(r, g, b);
}

/**
 * Convert HSV to RGB (needed for LAB conversion)
 */
function hsvToRgb(h: number, s: number, v: number): RGB {
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
}

/**
 * Curated list of HTML/CSS color names with their LAB values
 */
const HTML_COLOR_NAMES: NamedColor[] = [
  // Reds
  { name: "Crimson", hex: "#dc143c", lab: hexToLab("#dc143c") },
  { name: "Red", hex: "#ff0000", lab: hexToLab("#ff0000") },
  { name: "FireBrick", hex: "#b22222", lab: hexToLab("#b22222") },
  { name: "DarkRed", hex: "#8b0000", lab: hexToLab("#8b0000") },
  { name: "Tomato", hex: "#ff6347", lab: hexToLab("#ff6347") },
  { name: "Coral", hex: "#ff7f50", lab: hexToLab("#ff7f50") },
  { name: "IndianRed", hex: "#cd5c5c", lab: hexToLab("#cd5c5c") },
  { name: "LightCoral", hex: "#f08080", lab: hexToLab("#f08080") },
  { name: "Salmon", hex: "#fa8072", lab: hexToLab("#fa8072") },
  { name: "DarkSalmon", hex: "#e9967a", lab: hexToLab("#e9967a") },
  { name: "LightSalmon", hex: "#ffa07a", lab: hexToLab("#ffa07a") },

  // Oranges
  { name: "OrangeRed", hex: "#ff4500", lab: hexToLab("#ff4500") },
  { name: "Orange", hex: "#ffa500", lab: hexToLab("#ffa500") },
  { name: "DarkOrange", hex: "#ff8c00", lab: hexToLab("#ff8c00") },

  // Yellows
  { name: "Gold", hex: "#ffd700", lab: hexToLab("#ffd700") },
  { name: "Yellow", hex: "#ffff00", lab: hexToLab("#ffff00") },
  { name: "LightYellow", hex: "#ffffe0", lab: hexToLab("#ffffe0") },
  { name: "Khaki", hex: "#f0e68c", lab: hexToLab("#f0e68c") },
  { name: "DarkKhaki", hex: "#bdb76b", lab: hexToLab("#bdb76b") },

  // Greens
  { name: "GreenYellow", hex: "#adff2f", lab: hexToLab("#adff2f") },
  { name: "Chartreuse", hex: "#7fff00", lab: hexToLab("#7fff00") },
  { name: "LawnGreen", hex: "#7cfc00", lab: hexToLab("#7cfc00") },
  { name: "Lime", hex: "#00ff00", lab: hexToLab("#00ff00") },
  { name: "LimeGreen", hex: "#32cd32", lab: hexToLab("#32cd32") },
  { name: "Green", hex: "#008000", lab: hexToLab("#008000") },
  { name: "DarkGreen", hex: "#006400", lab: hexToLab("#006400") },
  { name: "ForestGreen", hex: "#228b22", lab: hexToLab("#228b22") },
  { name: "SeaGreen", hex: "#2e8b57", lab: hexToLab("#2e8b57") },
  { name: "MediumSeaGreen", hex: "#3cb371", lab: hexToLab("#3cb371") },
  { name: "SpringGreen", hex: "#00ff7f", lab: hexToLab("#00ff7f") },
  { name: "MediumSpringGreen", hex: "#00fa9a", lab: hexToLab("#00fa9a") },
  { name: "Teal", hex: "#008080", lab: hexToLab("#008080") },
  { name: "DarkCyan", hex: "#008b8b", lab: hexToLab("#008b8b") },
  { name: "LightSeaGreen", hex: "#20b2aa", lab: hexToLab("#20b2aa") },
  { name: "Aquamarine", hex: "#7fffd4", lab: hexToLab("#7fffd4") },
  { name: "MediumAquamarine", hex: "#66cdaa", lab: hexToLab("#66cdaa") },
  { name: "Turquoise", hex: "#40e0d0", lab: hexToLab("#40e0d0") },
  { name: "MediumTurquoise", hex: "#48d1cc", lab: hexToLab("#48d1cc") },
  { name: "DarkTurquoise", hex: "#00ced1", lab: hexToLab("#00ced1") },

  // Cyans
  { name: "Cyan", hex: "#00ffff", lab: hexToLab("#00ffff") },
  { name: "Aqua", hex: "#00ffff", lab: hexToLab("#00ffff") },
  { name: "LightCyan", hex: "#e0ffff", lab: hexToLab("#e0ffff") },

  // Blues
  { name: "CadetBlue", hex: "#5f9ea0", lab: hexToLab("#5f9ea0") },
  { name: "SteelBlue", hex: "#4682b4", lab: hexToLab("#4682b4") },
  { name: "LightSteelBlue", hex: "#b0c4de", lab: hexToLab("#b0c4de") },
  { name: "LightBlue", hex: "#add8e6", lab: hexToLab("#add8e6") },
  { name: "SkyBlue", hex: "#87ceeb", lab: hexToLab("#87ceeb") },
  { name: "LightSkyBlue", hex: "#87cefa", lab: hexToLab("#87cefa") },
  { name: "DeepSkyBlue", hex: "#00bfff", lab: hexToLab("#00bfff") },
  { name: "DodgerBlue", hex: "#1e90ff", lab: hexToLab("#1e90ff") },
  { name: "CornflowerBlue", hex: "#6495ed", lab: hexToLab("#6495ed") },
  { name: "RoyalBlue", hex: "#4169e1", lab: hexToLab("#4169e1") },
  { name: "Blue", hex: "#0000ff", lab: hexToLab("#0000ff") },
  { name: "MediumBlue", hex: "#0000cd", lab: hexToLab("#0000cd") },
  { name: "DarkBlue", hex: "#00008b", lab: hexToLab("#00008b") },
  { name: "Navy", hex: "#000080", lab: hexToLab("#000080") },
  { name: "MidnightBlue", hex: "#191970", lab: hexToLab("#191970") },

  // Purples
  { name: "Lavender", hex: "#e6e6fa", lab: hexToLab("#e6e6fa") },
  { name: "Thistle", hex: "#d8bfd8", lab: hexToLab("#d8bfd8") },
  { name: "Plum", hex: "#dda0dd", lab: hexToLab("#dda0dd") },
  { name: "Violet", hex: "#ee82ee", lab: hexToLab("#ee82ee") },
  { name: "Orchid", hex: "#da70d6", lab: hexToLab("#da70d6") },
  { name: "MediumOrchid", hex: "#ba55d3", lab: hexToLab("#ba55d3") },
  { name: "MediumPurple", hex: "#9370db", lab: hexToLab("#9370db") },
  { name: "BlueViolet", hex: "#8a2be2", lab: hexToLab("#8a2be2") },
  { name: "DarkViolet", hex: "#9400d3", lab: hexToLab("#9400d3") },
  { name: "DarkOrchid", hex: "#9932cc", lab: hexToLab("#9932cc") },
  { name: "DarkMagenta", hex: "#8b008b", lab: hexToLab("#8b008b") },
  { name: "Purple", hex: "#800080", lab: hexToLab("#800080") },
  { name: "Indigo", hex: "#4b0082", lab: hexToLab("#4b0082") },
  { name: "SlateBlue", hex: "#6a5acd", lab: hexToLab("#6a5acd") },
  { name: "DarkSlateBlue", hex: "#483d8b", lab: hexToLab("#483d8b") },
  { name: "MediumSlateBlue", hex: "#7b68ee", lab: hexToLab("#7b68ee") },

  // Magentas
  { name: "Magenta", hex: "#ff00ff", lab: hexToLab("#ff00ff") },
  { name: "Fuchsia", hex: "#ff00ff", lab: hexToLab("#ff00ff") },
  { name: "DeepPink", hex: "#ff1493", lab: hexToLab("#ff1493") },
  { name: "HotPink", hex: "#ff69b4", lab: hexToLab("#ff69b4") },
  { name: "MediumVioletRed", hex: "#c71585", lab: hexToLab("#c71585") },
  { name: "PaleVioletRed", hex: "#db7093", lab: hexToLab("#db7093") },

  // Pinks
  { name: "Pink", hex: "#ffc0cb", lab: hexToLab("#ffc0cb") },
  { name: "LightPink", hex: "#ffb6c1", lab: hexToLab("#ffb6c1") },

  // Browns - CRITICAL FOR YOUR USE CASE
  { name: "Maroon", hex: "#800000", lab: hexToLab("#800000") },
  { name: "Brown", hex: "#a52a2a", lab: hexToLab("#a52a2a") },
  { name: "SaddleBrown", hex: "#8b4513", lab: hexToLab("#8b4513") },
  { name: "Sienna", hex: "#a0522d", lab: hexToLab("#a0522d") },
  { name: "Chocolate", hex: "#d2691e", lab: hexToLab("#d2691e") },
  { name: "Peru", hex: "#cd853f", lab: hexToLab("#cd853f") },
  { name: "Tan", hex: "#d2b48c", lab: hexToLab("#d2b48c") },
  { name: "RosyBrown", hex: "#bc8f8f", lab: hexToLab("#bc8f8f") },
  { name: "SandyBrown", hex: "#f4a460", lab: hexToLab("#f4a460") },
  { name: "Goldenrod", hex: "#daa520", lab: hexToLab("#daa520") },
  { name: "DarkGoldenrod", hex: "#b8860b", lab: hexToLab("#b8860b") },

  // Grays and Neutrals
  { name: "White", hex: "#ffffff", lab: hexToLab("#ffffff") },
  { name: "Snow", hex: "#fffafa", lab: hexToLab("#fffafa") },
  { name: "Ivory", hex: "#fffff0", lab: hexToLab("#fffff0") },
  { name: "Beige", hex: "#f5f5dc", lab: hexToLab("#f5f5dc") },
  { name: "Linen", hex: "#faf0e6", lab: hexToLab("#faf0e6") },
  { name: "AntiqueWhite", hex: "#faebd7", lab: hexToLab("#faebd7") },
  { name: "Wheat", hex: "#f5deb3", lab: hexToLab("#f5deb3") },
  { name: "Gainsboro", hex: "#dcdcdc", lab: hexToLab("#dcdcdc") },
  { name: "LightGray", hex: "#d3d3d3", lab: hexToLab("#d3d3d3") },
  { name: "Silver", hex: "#c0c0c0", lab: hexToLab("#c0c0c0") },
  { name: "DarkGray", hex: "#a9a9a9", lab: hexToLab("#a9a9a9") },
  { name: "Gray", hex: "#808080", lab: hexToLab("#808080") },
  { name: "DimGray", hex: "#696969", lab: hexToLab("#696969") },
  { name: "SlateGray", hex: "#708090", lab: hexToLab("#708090") },
  { name: "DarkSlateGray", hex: "#2f4f4f", lab: hexToLab("#2f4f4f") },
  { name: "Black", hex: "#000000", lab: hexToLab("#000000") },
];

/**
 * Calculate Delta E (CIE76) - Euclidean distance in LAB space
 * This is perceptually uniform, unlike HSV distance
 */
function calculateDeltaE(lab1: LAB, lab2: LAB): number {
  return Math.sqrt(
    Math.pow(lab1.l - lab2.l, 2) +
      Math.pow(lab1.a - lab2.a, 2) +
      Math.pow(lab1.b - lab2.b, 2)
  );
}

/**
 * Maps an HSV color to the closest HTML/CSS color name using LAB color space.
 * Returns both the name and the Delta E distance.
 */
// Simple cache with size limit to avoid expensive LAB conversions
const colorNameCache = new Map<string, { name: string; distance: number }>();
const MAX_CACHE_SIZE = 500;

export function getClosestColorName(hsv: HSV): {
  name: string;
  distance: number;
} {
  // Create cache key with 1 decimal precision (balance between hits and uniqueness)
  const key = `${hsv.h.toFixed(1)}-${hsv.s.toFixed(1)}-${hsv.v.toFixed(1)}`;

  // Return cached result if available
  const cached = colorNameCache.get(key);
  if (cached) {
    return cached;
  }

  // Convert HSV to RGB first, then to LAB
  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const inputLab = rgbToLab(rgb.r, rgb.g, rgb.b);

  let closestColor = HTML_COLOR_NAMES[0];
  let minDistance = calculateDeltaE(inputLab, closestColor.lab);

  for (const namedColor of HTML_COLOR_NAMES) {
    const distance = calculateDeltaE(inputLab, namedColor.lab);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = namedColor;
    }
  }

  const result = {
    name: closestColor.name,
    distance: minDistance,
  };

  // Store result with simple size-based eviction
  if (colorNameCache.size >= MAX_CACHE_SIZE) {
    // Remove first (oldest) entry
    const firstKey = colorNameCache.keys().next().value;
    if (firstKey) {
      colorNameCache.delete(firstKey);
    }
  }
  colorNameCache.set(key, result);

  return result;
}

/**
 * Gets a human-readable color name for an HSV color.
 * Simplified version that just returns the name.
 */
export function getColorName(hsv: HSV): string {
  return getClosestColorName(hsv).name;
}

/**
 * Gets a human-readable color name with quality indicator.
 * Returns a descriptive string indicating confidence in the match.
 *
 * Delta E thresholds:
 * - < 2.3: Not perceptible to human eyes (high confidence)
 * - 2.3-5: Perceptible through close observation (medium confidence)
 * - > 5: Clear difference (low confidence)
 */
export function getColorNameWithConfidence(hsv: HSV): {
  name: string;
  confidence: "high" | "medium" | "low";
  deltaE: number;
} {
  const { name, distance } = getClosestColorName(hsv);

  let confidence: "high" | "medium" | "low";
  if (distance < 10) {
    confidence = "high";
  } else if (distance < 20) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  return { name, confidence, deltaE: distance };
}
