'use client';

import { createTheme as createMuiTheme } from '@mui/material/styles';
import { createPalette } from './palette/index';
import { createTypography } from './typography';
import { createComponents } from './components/index';

import { PaletteMode } from '@mui/material';

export const createTheme = (mode: PaletteMode = 'light') => {
  const palette = createPalette(mode);
  const typography = createTypography();
  
  // Create base theme
  const baseTheme = createMuiTheme({
    palette,
    typography,
    // Add other base configurations here
  });

  // Add component overrides
  const components = createComponents(baseTheme);

  // Return complete theme
  return createMuiTheme({
    palette,
    typography,
    components,
    // Other global theme settings
  });
};

// Default export for immediate use
const theme = createTheme();
export default theme;