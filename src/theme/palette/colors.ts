// src/theme/palette/colors.ts

// original muiColors https://mui.com/material-ui/customization/color/#color-palette
import * as muiColors from "@mui/material/colors";
import { WileyColors } from "./WileyColors";

// White-label color overrides (using Wiley brand colors as a baseline)
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

const customRed = {
  50: "#FFE8E8", // ReX light red
  100: "#FFCBCB",
  200: "#F9A4A4",
  300: "#EC7878",
  400: "#D54D4D",
  500: "#B72D2D", // ReX main red
  600: "#941C1C",
  700: "#711212",
  800: "#4C0A0A",
  900: "#260404",
};

const customPink = {
  50: "#FFD6DA",
  100: "#FFB3BF",
  200: WileyColors.berry.bright,
  300: "#F96FA4",
  400: "#E24B98",
  500: WileyColors.berry.medium,
  600: WileyColors.berry.dark,
  700: "#70134E",
  800: "#4E0A38",
  900: "#200218",
};

// Export merged colors (MUI + white-label overrides)
export const blue = customBlue;
export const green = customGreen;
export const grey = { ...muiColors.grey /* add overrides if needed */ };
export const red = customRed;
export const orange = { ...muiColors.orange /* add overrides if needed */ };
export const pink = customPink;

// Re-export unmodified MUI colors
export const amber = muiColors.amber;
export const brown = muiColors.brown;
export const cyan = muiColors.cyan;
// ... other colors you're not overriding

export const common = {
  black: "#000000",
  white: "#ffffff",
};
