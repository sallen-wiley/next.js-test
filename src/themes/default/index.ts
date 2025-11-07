"use client";
import { createTheme } from "@mui/material/styles";

// Default MUI theme with minimal customization
// This provides the standard Material-UI experience with light/dark mode support
const defaultTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data", // Enable manual mode switching
  },
  colorSchemes: {
    light: {
      // Use MUI's default light mode palette
      palette: {
        mode: "light",
      },
    },
    dark: {
      // Use MUI's default dark mode palette
      palette: {
        mode: "dark",
      },
    },
  },
  typography: {
    // Use MUI's default typography (Roboto)
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 4, // MUI's default border radius
  },
  components: {
    // Minimal customization to ensure consistency with your app structure
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-display: swap;
          font-weight: 100 900;
          src: url('/fonts/Roboto/Roboto-VariableFont_wdth,wght.ttf') format('truetype');
        }

        @font-face {
          font-family: 'Roboto';
          font-style: italic;
          font-display: swap;
          font-weight: 100 900;
          src: url('/fonts/Roboto/Roboto-Italic-VariableFont_wdth,wght.ttf') format('truetype');
        }
      `,
    },
  },
});

export default defaultTheme;