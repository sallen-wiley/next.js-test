// src/theme/palette/colors.ts

// original muiColors https://mui.com/material-ui/customization/color/#color-palette
import * as muiColors from "@mui/material/colors";
import { designTokens } from "./brandTokens";

// Direct mapping: Phenom Primary Blue → MUI Blue
// Clear mapping between tenant shades and MUI levels
const phenomPrimaryBlue = {
  // Lightest shades (backgrounds, subtle elements)
  50: designTokens.colorPrimitives.primary.blue[5], // #F3F8F9 - Tenant 5% → MUI 50 (lightest)
  100: designTokens.colorPrimitives.primary.blue[10], // #E7F1F3 - Tenant 10% → MUI 100
  200: designTokens.colorPrimitives.primary.blue[20], // #CEE3E7 - Tenant 20% → MUI 200

  // Mid-range shades (borders, hover states)
  300: "#7DB8C4", // Interpolated between tenant 20% and 40%
  400: designTokens.colorPrimitives.primary.blue[40], // #9DC7CF - Tenant 40% → MUI 400
  500: designTokens.colorPrimitives.primary.blue[60], // #6CABB8 - Tenant 60% → MUI 500 (main)

  // Darker shades (primary elements, text)
  600: designTokens.colorPrimitives.primary.blue[80], // #3B8FA0 - Tenant 80% → MUI 600
  700: designTokens.colorPrimitives.primary.blue[100], // #0A7388 - Tenant 100% → MUI 700
  800: "#075965", // Darker than tenant 100% - for hover/pressed states
  900: "#043B44", // Darkest shade - for high contrast text
};

// Direct mapping: Phenom Primary Dark Blue → MUI Cyan
// Clear mapping between tenant shades and MUI levels
const phenomPrimaryDarkBlue = {
  // Lightest shades (backgrounds, subtle elements)
  50: designTokens.colorPrimitives.primary.darkBlue[5], // #F2F6F7 - Tenant 5% → MUI 50 (lightest)
  100: designTokens.colorPrimitives.primary.darkBlue[10], // #E6EDEE - Tenant 10% → MUI 100
  200: designTokens.colorPrimitives.primary.darkBlue[20], // #CDBDDD - Tenant 20% → MUI 200

  // Mid-range shades (borders, hover states)
  300: "#618B96", // Interpolated between tenant 20% and 40%
  400: designTokens.colorPrimitives.primary.darkBlue[40], // #9AB7BC - Tenant 40% → MUI 400
  500: designTokens.colorPrimitives.primary.darkBlue[60], // #68929A - Tenant 60% → MUI 500 (main)

  // Darker shades (primary elements, text)
  600: designTokens.colorPrimitives.primary.darkBlue[80], // #356E79 - Tenant 80% → MUI 600
  700: designTokens.colorPrimitives.primary.darkBlue[100], // #034A57 - Tenant 100% → MUI 700
  800: "#024048", // Darker than tenant 100% - for hover/pressed states
  900: "#012A30", // Darkest shade - for high contrast text
};

// Direct mapping: Phenom Primary Dark Green → MUI Green
// Clear mapping between tenant shades and MUI levels
const phenomPrimaryDarkGreen = {
  // Lightest shades (backgrounds, subtle elements)
  50: designTokens.colorPrimitives.primary.darkGreen[5], // #f3f7f5 - Tenant 5% → MUI 50 (lightest)
  100: designTokens.colorPrimitives.primary.darkGreen[10], // #e7efeb - Tenant 10% → MUI 100
  200: designTokens.colorPrimitives.primary.darkGreen[20], // #cfded7 - Tenant 20% → MUI 200

  // Mid-range shades (borders, hover states)
  300: "#98B595", // Interpolated between tenant 20% and 40%
  400: designTokens.colorPrimitives.primary.darkGreen[40], // #a0beaf - Tenant 40% → MUI 400
  500: designTokens.colorPrimitives.primary.darkGreen[60], // #709d86 - Tenant 60% → MUI 500 (main)

  // Darker shades (primary elements, text)
  600: designTokens.colorPrimitives.primary.darkGreen[80], // #417d5e - Tenant 80% → MUI 600
  700: designTokens.colorPrimitives.primary.darkGreen[100], // #115c36 - Tenant 100% → MUI 700
  800: "#245420", // Darker than tenant 100% - for hover/pressed states
  900: "#193916", // Darkest shade - for high contrast text
};

// Direct mapping: Phenom Primary Green → MUI Light Green
// Clear mapping between tenant shades and MUI levels
const phenomPrimaryGreen = {
  // Lightest shades (backgrounds, subtle elements)
  50: designTokens.colorPrimitives.primary.green[5], // #e7efee - Tenant 5% → MUI 50 (lightest)
  100: designTokens.colorPrimitives.primary.green[10], // #dce9e6 - Tenant 10% → MUI 100
  200: designTokens.colorPrimitives.primary.green[20], // #c7dfd7 - Tenant 20% → MUI 200

  // Mid-range shades (borders, hover states)
  300: "#AED29E", // Interpolated between tenant 20% and 40%
  400: designTokens.colorPrimitives.primary.green[40], // #9bcab5 - Tenant 40% → MUI 400
  500: designTokens.colorPrimitives.primary.green[60], // #70b695 - Tenant 60% → MUI 500 (main)

  // Darker shades (primary elements, text)
  600: designTokens.colorPrimitives.primary.green[80], // #44a174 - Tenant 80% → MUI 600
  700: designTokens.colorPrimitives.primary.green[100], // #198c53 - Tenant 100% → MUI 700
  800: "#427E2F", // Darker than tenant 100% - for hover/pressed states
  900: "#2D5621", // Darkest shade - for high contrast text
};

// Custom colors using Phenom brand colors
const customRed = {
  50: "#FFE8E8",
  100: "#FFCBCB",
  200: "#F9A4A4",
  300: "#EC7878",
  400: "#D54D4D",
  500: "#B72D2D",
  600: "#941C1C",
  700: "#711212",
  800: "#4C0A0A",
  900: "#260404",
};

const customPink = {
  50: "#FFD6DA",
  100: "#FFB3BF",
  200: designTokens.colorPrimitives.secondary.warmRed[40], // Using warm red from design tokens
  300: "#F96FA4",
  400: "#E24B98",
  500: designTokens.colorPrimitives.secondary.warmRed[80], // Using warm red from design tokens
  600: designTokens.colorPrimitives.secondary.warmRed[100], // Using warm red from design tokens
  700: "#70134E",
  800: "#4E0A38",
  900: "#200218",
};

const customOrange = {
  50: "#FFF0E8",
  100: "#FAD8C6",
  200: "#F5B58F",
  300: "#ED7632",
  400: "#DE5A08",
  500: "#CC4E00",
  600: "#B44800",
  700: "#973C00",
  800: "#742E00",
  900: "#3D1800",
};

// Export Phenom color palettes mapped to MUI structure
export const blue = phenomPrimaryBlue; // Phenom Primary Blue mapped to MUI blue
export const cyan = phenomPrimaryDarkBlue; // Phenom Primary Dark Blue mapped to MUI cyan
export const green = phenomPrimaryDarkGreen; // Phenom Primary Dark Green mapped to MUI green
export const lightGreen = phenomPrimaryGreen; // Phenom Primary Green mapped to MUI lightGreen
export const grey = { ...muiColors.grey /* add overrides if needed */ };
export const red = customRed;
export const orange = customOrange;
export const pink = customPink;

// Re-export unmodified MUI colors (excluding ones we've customized)
export const amber = muiColors.amber;
export const brown = muiColors.brown;
export const deepOrange = muiColors.deepOrange;
export const deepPurple = muiColors.deepPurple;
export const indigo = muiColors.indigo;
export const lightBlue = muiColors.lightBlue;
export const lime = muiColors.lime;
export const purple = muiColors.purple;
export const teal = muiColors.teal;
export const yellow = muiColors.yellow;

export const common = {
  black: "#000000",
  white: "#ffffff",
};
