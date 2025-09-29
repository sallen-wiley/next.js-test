"use client";
import { createTheme } from "@mui/material/styles";

// Tech theme using IBM Plex Mono for a coding/development focused brand
const techTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class", // Enable manual mode switching
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#00C853", // Bright green (terminal/code)
          light: "#5EFC82",
          dark: "#009624",
        },
        secondary: {
          main: "#FF9800", // Warning orange
          light: "#FFB74D",
          dark: "#F57C00",
        },
        background: {
          default: "#F5F5F5",
          paper: "#FFFFFF",
        },
        text: {
          primary: "#1B1B1B",
          secondary: "#424242",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#4CAF50",
          light: "#81C784",
          dark: "#388E3C",
        },
        secondary: {
          main: "#FFB74D",
          light: "#FFD54F",
          dark: "#FF9800",
        },
        background: {
          default: "#121212", // Terminal dark
          paper: "#1E1E1E",
        },
        text: {
          primary: "#E0E0E0",
          secondary: "#BDBDBD",
        },
      },
    },
  },
  typography: {
    fontFamily: "IBM Plex Mono, Monaco, Consolas, monospace", // Monospace for tech feel
    h1: {
      fontWeight: 500, // Monospace fonts work better with lighter weights
      letterSpacing: "-0.01em",
    },
    h2: {
      fontWeight: 500,
      letterSpacing: "0em",
    },
    h3: {
      fontWeight: 400,
    },
    body1: {
      lineHeight: 1.6,
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 4, // Sharp, precise corners
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'IBM Plex Mono';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url('/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf') format('truetype');
        }
        @font-face {
          font-family: 'IBM Plex Mono';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: url('/fonts/IBM_Plex_Mono/IBMPlexMono-Medium.ttf') format('truetype');
        }
        @font-face {
          font-family: 'IBM Plex Mono';
          font-style: normal;
          font-display: swap;
          font-weight: 600;
          src: url('/fonts/IBM_Plex_Mono/IBMPlexMono-SemiBold.ttf') format('truetype');
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 4,
          fontWeight: 500,
          letterSpacing: "0.02em",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

export default techTheme;
