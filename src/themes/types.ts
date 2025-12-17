import "@mui/material/styles";

/**
 * Global theme type augmentations for MUI components
 * These declarations apply to all themes in the application
 */

declare module "@mui/material/styles" {
  interface Palette {
    /** Custom neutral color palette for all themes */
    neutral: Palette["primary"];
    /** Custom black color palette for all themes */
    black: Palette["primary"];
    /** Custom white color palette for all themes */
    white: Palette["primary"];
  }

  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
    black?: PaletteOptions["primary"];
    white?: PaletteOptions["primary"];
  }
}

// Enable the new colors for Button components
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
    black: true;
    white: true;
  }

  // Global size overrides (can be extended per theme)
  interface ButtonPropsSizeOverrides {
    extraLarge: true;
  }
}

// Enable for Chip components
declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    neutral: true;
    black: true;
    white: true;
  }

  interface ChipPropsVariantOverrides {
    "solid-light": true;
  }
}
