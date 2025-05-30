import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
    black: Palette["primary"];
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
}

// Enable for Chip components
declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    neutral: true;
    black: true;
    white: true;
  }
}
