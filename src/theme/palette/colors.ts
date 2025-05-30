// src/theme/palette/colors.ts
import * as muiColors from '@mui/material/colors';
import { WileyColors } from './WileyColors';

// White-label color overrides (Layer 2)
const customBlue = {
  50: "#D8F0FA",
  100: "#8CC8EE",
  200: "#4BA1DC",
  300: "#2B7EC3",
  400: WileyColors.blue.medium,
  500: WileyColors.blue.dark,
  600: "#0B2760",
  700: "#071943",
  800: "#040E28",
  900: "#020613",
};

const customGreen = {
  50: "#E8FFF2",
  100: "#C2F9DB",
  200: "#84E6B2",
  300: "#4DC185",
  400: "#288F5C",
  500: WileyColors.green.dark,
  600: "#06351E",
  700: "#022112",
  800: "#01140B",
  900: "#000805",
};

// Export merged colors (MUI + white-label overrides)
export const blue = customBlue;
export const green = customGreen;
export const grey = { ...muiColors.grey /* add overrides if needed */ };
export const red = { ...muiColors.red /* add overrides if needed */ };
export const orange = { ...muiColors.orange /* add overrides if needed */ };
export const pink = { ...muiColors.pink /* add overrides if needed */ };

// Re-export unmodified MUI colors
export const amber = muiColors.amber;
export const brown = muiColors.brown;
export const cyan = muiColors.cyan;
// ... other colors you're not overriding

export const common = {
  black: "#000000",
  white: "#ffffff",
};