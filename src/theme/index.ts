"use client";

import { createTheme as createMuiTheme } from "@mui/material/styles";
import { createPalette } from "./palette/index";
import { createTypography } from "./typography";
import { createComponents } from "./components/index";
import { breakpoints, spacing } from "./foundations";

import "./types";

import { PaletteMode } from "@mui/material";
// import clientTheme from "./clientTheme";

export const createTheme = (mode: PaletteMode = "light") => {
  const palette = createPalette(mode);
  const typography = createTypography();

  // Client-customizable shape (border radius can vary per client)
  const shape = {
    borderRadius: 10, // Default value, can be overridden by client theme
  };

  // Create base theme
  const baseTheme = createMuiTheme({
    palette,
    typography,
    breakpoints,
    spacing,
    shape, // Client-customizable
    // Add other base configurations here
  });

  // Add component overrides
  const components = createComponents(baseTheme);

  // Merge baseTheme with clientTheme
  return createMuiTheme(
    {
      ...baseTheme,
      components,
    }
    // clientTheme // This will override or extend the base theme
  );
};

// Default export for immediate use
const theme = createTheme();
export default theme;
