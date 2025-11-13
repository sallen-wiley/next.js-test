/**
 * Maps HSV color values to human-readable color names based on HTML/CSS color names.
 * Uses Euclidean distance in HSV color space to find the closest matching name.
 */

interface HSV {
  h: number; // 0-360 degrees
  s: number; // 0-100 percent
  v: number; // 0-100 percent
}

interface NamedColor {
  name: string;
  hsv: HSV;
}

/**
 * Curated list of HTML/CSS color names with their HSV equivalents.
 * Focused on common, distinctive colors that work well as palette names.
 */
const HTML_COLOR_NAMES: NamedColor[] = [
  // Reds
  { name: "Crimson", hsv: { h: 348, s: 83, v: 86 } },
  { name: "Red", hsv: { h: 0, s: 100, v: 100 } },
  { name: "FireBrick", hsv: { h: 0, s: 81, v: 70 } },
  { name: "DarkRed", hsv: { h: 0, s: 100, v: 55 } },
  { name: "Tomato", hsv: { h: 9, s: 72, v: 100 } },
  { name: "Coral", hsv: { h: 16, s: 69, v: 100 } },
  { name: "IndianRed", hsv: { h: 0, s: 53, v: 80 } },
  { name: "LightCoral", hsv: { h: 0, s: 47, v: 94 } },
  { name: "Salmon", hsv: { h: 6, s: 54, v: 98 } },
  { name: "DarkSalmon", hsv: { h: 15, s: 48, v: 91 } },
  { name: "LightSalmon", hsv: { h: 17, s: 52, v: 100 } },

  // Oranges
  { name: "OrangeRed", hsv: { h: 16, s: 100, v: 100 } },
  { name: "Orange", hsv: { h: 39, s: 100, v: 100 } },
  { name: "DarkOrange", hsv: { h: 33, s: 100, v: 100 } },

  // Yellows
  { name: "Gold", hsv: { h: 51, s: 100, v: 100 } },
  { name: "Yellow", hsv: { h: 60, s: 100, v: 100 } },
  { name: "LightYellow", hsv: { h: 60, s: 6, v: 100 } },
  { name: "Khaki", hsv: { h: 54, s: 42, v: 94 } },
  { name: "DarkKhaki", hsv: { h: 56, s: 38, v: 74 } },

  // Greens
  { name: "GreenYellow", hsv: { h: 84, s: 76, v: 100 } },
  { name: "Chartreuse", hsv: { h: 90, s: 100, v: 100 } },
  { name: "LawnGreen", hsv: { h: 90, s: 100, v: 99 } },
  { name: "Lime", hsv: { h: 120, s: 100, v: 100 } },
  { name: "LimeGreen", hsv: { h: 120, s: 61, v: 80 } },
  { name: "Green", hsv: { h: 120, s: 100, v: 50 } },
  { name: "DarkGreen", hsv: { h: 120, s: 100, v: 39 } },
  { name: "ForestGreen", hsv: { h: 120, s: 76, v: 55 } },
  { name: "SeaGreen", hsv: { h: 146, s: 50, v: 56 } },
  { name: "MediumSeaGreen", hsv: { h: 147, s: 50, v: 70 } },
  { name: "SpringGreen", hsv: { h: 150, s: 100, v: 100 } },
  { name: "MediumSpringGreen", hsv: { h: 157, s: 100, v: 98 } },
  { name: "Teal", hsv: { h: 180, s: 100, v: 50 } },
  { name: "DarkCyan", hsv: { h: 180, s: 100, v: 55 } },
  { name: "LightSeaGreen", hsv: { h: 177, s: 70, v: 70 } },
  { name: "Aquamarine", hsv: { h: 160, s: 50, v: 100 } },
  { name: "MediumAquamarine", hsv: { h: 160, s: 51, v: 80 } },
  { name: "Turquoise", hsv: { h: 174, s: 72, v: 88 } },
  { name: "MediumTurquoise", hsv: { h: 178, s: 60, v: 82 } },
  { name: "DarkTurquoise", hsv: { h: 181, s: 100, v: 82 } },

  // Cyans
  { name: "Cyan", hsv: { h: 180, s: 100, v: 100 } },
  { name: "Aqua", hsv: { h: 180, s: 100, v: 100 } },
  { name: "LightCyan", hsv: { h: 180, s: 12, v: 100 } },

  // Blues
  { name: "CadetBlue", hsv: { h: 182, s: 41, v: 63 } },
  { name: "SteelBlue", hsv: { h: 207, s: 61, v: 71 } },
  { name: "LightSteelBlue", hsv: { h: 214, s: 21, v: 87 } },
  { name: "LightBlue", hsv: { h: 195, s: 25, v: 90 } },
  { name: "SkyBlue", hsv: { h: 197, s: 43, v: 92 } },
  { name: "LightSkyBlue", hsv: { h: 203, s: 46, v: 98 } },
  { name: "DeepSkyBlue", hsv: { h: 195, s: 100, v: 100 } },
  { name: "DodgerBlue", hsv: { h: 210, s: 88, v: 100 } },
  { name: "CornflowerBlue", hsv: { h: 219, s: 58, v: 93 } },
  { name: "RoyalBlue", hsv: { h: 225, s: 73, v: 88 } },
  { name: "Blue", hsv: { h: 240, s: 100, v: 100 } },
  { name: "MediumBlue", hsv: { h: 240, s: 100, v: 80 } },
  { name: "DarkBlue", hsv: { h: 240, s: 100, v: 55 } },
  { name: "Navy", hsv: { h: 240, s: 100, v: 50 } },
  { name: "MidnightBlue", hsv: { h: 240, s: 78, v: 44 } },

  // Purples
  { name: "Lavender", hsv: { h: 240, s: 8, v: 98 } },
  { name: "Thistle", hsv: { h: 300, s: 12, v: 85 } },
  { name: "Plum", hsv: { h: 300, s: 25, v: 87 } },
  { name: "Violet", hsv: { h: 300, s: 47, v: 93 } },
  { name: "Orchid", hsv: { h: 302, s: 49, v: 85 } },
  { name: "MediumOrchid", hsv: { h: 288, s: 59, v: 83 } },
  { name: "MediumPurple", hsv: { h: 260, s: 48, v: 86 } },
  { name: "BlueViolet", hsv: { h: 271, s: 81, v: 89 } },
  { name: "DarkViolet", hsv: { h: 282, s: 100, v: 83 } },
  { name: "DarkOrchid", hsv: { h: 280, s: 76, v: 80 } },
  { name: "DarkMagenta", hsv: { h: 300, s: 100, v: 55 } },
  { name: "Purple", hsv: { h: 300, s: 100, v: 50 } },
  { name: "Indigo", hsv: { h: 275, s: 100, v: 51 } },
  { name: "SlateBlue", hsv: { h: 248, s: 53, v: 80 } },
  { name: "DarkSlateBlue", hsv: { h: 248, s: 56, v: 55 } },
  { name: "MediumSlateBlue", hsv: { h: 249, s: 56, v: 93 } },

  // Magentas
  { name: "Magenta", hsv: { h: 300, s: 100, v: 100 } },
  { name: "Fuchsia", hsv: { h: 300, s: 100, v: 100 } },
  { name: "DeepPink", hsv: { h: 328, s: 92, v: 100 } },
  { name: "HotPink", hsv: { h: 330, s: 59, v: 100 } },
  { name: "MediumVioletRed", hsv: { h: 322, s: 81, v: 78 } },
  { name: "PaleVioletRed", hsv: { h: 340, s: 49, v: 86 } },

  // Pinks
  { name: "Pink", hsv: { h: 350, s: 25, v: 100 } },
  { name: "LightPink", hsv: { h: 351, s: 29, v: 100 } },

  // Browns
  { name: "Maroon", hsv: { h: 0, s: 100, v: 50 } },
  { name: "Brown", hsv: { h: 0, s: 59, v: 65 } },
  { name: "SaddleBrown", hsv: { h: 25, s: 76, v: 55 } },
  { name: "Sienna", hsv: { h: 19, s: 72, v: 63 } },
  { name: "Chocolate", hsv: { h: 25, s: 75, v: 82 } },
  { name: "Peru", hsv: { h: 30, s: 59, v: 80 } },
  { name: "Tan", hsv: { h: 34, s: 33, v: 82 } },
  { name: "RosyBrown", hsv: { h: 0, s: 25, v: 74 } },
  { name: "SandyBrown", hsv: { h: 28, s: 61, v: 96 } },
  { name: "Goldenrod", hsv: { h: 43, s: 74, v: 85 } },
  { name: "DarkGoldenrod", hsv: { h: 43, s: 72, v: 72 } },

  // Grays and Neutrals
  { name: "White", hsv: { h: 0, s: 0, v: 100 } },
  { name: "Snow", hsv: { h: 0, s: 1, v: 100 } },
  { name: "Ivory", hsv: { h: 60, s: 6, v: 100 } },
  { name: "Beige", hsv: { h: 60, s: 10, v: 96 } },
  { name: "Linen", hsv: { h: 30, s: 8, v: 98 } },
  { name: "AntiqueWhite", hsv: { h: 34, s: 14, v: 98 } },
  { name: "Wheat", hsv: { h: 39, s: 23, v: 96 } },
  { name: "Gainsboro", hsv: { h: 0, s: 0, v: 86 } },
  { name: "LightGray", hsv: { h: 0, s: 0, v: 83 } },
  { name: "Silver", hsv: { h: 0, s: 0, v: 75 } },
  { name: "DarkGray", hsv: { h: 0, s: 0, v: 66 } },
  { name: "Gray", hsv: { h: 0, s: 0, v: 50 } },
  { name: "DimGray", hsv: { h: 0, s: 0, v: 41 } },
  { name: "SlateGray", hsv: { h: 210, s: 13, v: 56 } },
  { name: "DarkSlateGray", hsv: { h: 180, s: 25, v: 31 } },
  { name: "Black", hsv: { h: 0, s: 0, v: 0 } },
];

/**
 * Calculate the Euclidean distance between two HSV colors.
 * Uses weighted components to better match human color perception.
 */
function calculateColorDistance(color1: HSV, color2: HSV): number {
  // Handle hue wraparound (e.g., 359° and 1° are close)
  let hueDiff = Math.abs(color1.h - color2.h);
  if (hueDiff > 180) {
    hueDiff = 360 - hueDiff;
  }

  // Weight factors tuned for better perceptual matching
  // Hue differences are most significant for saturated colors
  // For desaturated colors, value becomes more important
  const saturationWeight = Math.min(color1.s, color2.s) / 100; // Reduce hue importance for grays
  const hueWeight = saturationWeight * 2.0; // Hue matters more when colors are saturated
  const satWeight = 1.0;
  const valWeight = 1.5; // Value is quite perceptually significant

  // Calculate weighted Euclidean distance
  const distance = Math.sqrt(
    Math.pow(hueDiff * hueWeight, 2) +
      Math.pow((color1.s - color2.s) * satWeight, 2) +
      Math.pow((color1.v - color2.v) * valWeight, 2)
  );

  return distance;
}

/**
 * Maps an HSV color to the closest HTML/CSS color name.
 * Returns both the name and the distance to help assess match quality.
 */
export function getClosestColorName(hsv: HSV): {
  name: string;
  distance: number;
} {
  let closestColor = HTML_COLOR_NAMES[0];
  let minDistance = calculateColorDistance(hsv, closestColor.hsv);

  for (const namedColor of HTML_COLOR_NAMES) {
    const distance = calculateColorDistance(hsv, namedColor.hsv);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = namedColor;
    }
  }

  return {
    name: closestColor.name,
    distance: minDistance,
  };
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
 */
export function getColorNameWithConfidence(hsv: HSV): {
  name: string;
  confidence: "high" | "medium" | "low";
} {
  const { name, distance } = getClosestColorName(hsv);

  // Thresholds tuned based on testing
  let confidence: "high" | "medium" | "low";
  if (distance < 15) {
    confidence = "high";
  } else if (distance < 30) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  return { name, confidence };
}
