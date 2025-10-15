export const brandColors = {
  // Primary Blue - Phenom's main blue palette
  primaryBlue: {
    100: "#0A7388", // Darkest - 100% shade
    80: "#3B8FA0", // 80% shade
    60: "#6CABB8", // 60% shade
    40: "#9DC7CF", // 40% shade
    20: "#CEE3E7", // 20% shade
    10: "#E7F1F3", // 10% shade
    5: "#F3F8F9", // 5% shade - Lightest
  },
  // Primary Dark Blue - Phenom's secondary blue palette
  primaryDarkBlue: {
    100: "#034A57", // Darkest - 100% shade
    80: "#356E79", // 80% shade - from Figma variable
    60: "#5A8A9B", // 60% shade - interpolated
    40: "#7FA6BD", // 40% shade - interpolated
    20: "#A4C2DF", // 20% shade - interpolated
    10: "#C9DEF1", // 10% shade - interpolated
    5: "#E4F1F8", // 5% shade - interpolated
  },
  // Primary Green - Phenom's main green palette
  primaryGreen: {
    100: "#56A03D", // Darkest - 100% shade
    80: "#78B364", // 80% shade
    60: "#9AC68B", // 60% shade
    40: "#BBD9B1", // 40% shade
    20: "#DDECD8", // 20% shade
    10: "#EEF6EC", // 10% shade
    5: "#F7FAF5", // 5% shade - Lightest
  },
  // Primary Dark Green - Phenom's secondary green palette
  primaryDarkGreen: {
    100: "#32662B", // Darkest - 100% shade
    80: "#5B8555", // 80% shade
    60: "#84A380", // 60% shade
    40: "#ADC2AA", // 40% shade
    20: "#D6E0D5", // 20% shade
    10: "#EBF0EA", // 10% shade
    5: "#F5F7F4", // 5% shade - Lightest
  },
  // Keep existing colors for backward compatibility
  green: {
    dark: "#059669", // Emerald green for Phenom
    medium: "#10B981",
    bright: "#34D399",
  },
  berry: {
    dark: "#7C3AED", // Purple accent for Phenom
    medium: "#8B5CF6",
    bright: "#A78BFA",
  },
  yellow: {
    dark: "#F59E0B", // Amber for Phenom
    medium: "#FBBF24",
    bright: "#FCD34D",
  },
};

// Keep the original export for backward compatibility
export const wileyColors = brandColors;
