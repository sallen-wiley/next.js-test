"use client";
import { createTheme } from "@mui/material/styles";

// Sage theme using Source Serif 4 for an elegant, nature-inspired look
const sageTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class", // Enable manual mode switching
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#2E8B57", // Sea Green
          light: "#4FD07B",
          dark: "#1E5F3C",
        },
        secondary: {
          main: "#8FBC8F", // Dark Sea Green
          light: "#B4D4B4",
          dark: "#6B8E6B",
        },
        background: {
          default: "#F8FDF8",
          paper: "#FFFFFF",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#4FD07B",
          light: "#7AE8A3",
          dark: "#2E8B57",
        },
        secondary: {
          main: "#B4D4B4",
          light: "#D4F4D4",
          dark: "#8FBC8F",
        },
        background: {
          default: "#0D1B0F",
          paper: "#1A2F1D",
        },
      },
    },
  },
  typography: {
    // Default font family for most text (sans-serif)
    fontFamily: "'Inter'",

    // Headings use serif font
    h1: {
      fontFamily: "'Source Serif 4'",
      fontWeight: 600,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: "'Source Serif 4'",
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontFamily: "'Source Serif 4'",
      fontWeight: 500,
    },
    h4: {
      fontFamily: "'Source Serif 4'",
      fontWeight: 500,
    },
    h5: {
      fontFamily: "'Source Serif 4'",
      fontWeight: 500,
    },
    h6: {
      fontFamily: "'Source Serif 4'",
      fontWeight: 500,
    },

    // Buttons use monospace font
    button: {
      fontFamily: "'IBM Plex Mono'",
      // fontWeight: 800,
      letterSpacing: "0.02em",
    },

    // Body text uses sans-serif (default fontFamily)
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.6,
    },

    // Subtitles use sans-serif (default fontFamily)
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },

    // Small text uses sans-serif (default fontFamily)
    caption: {
      letterSpacing: "0.03em",
    },
    overline: {
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 12, // Softer, more organic shapes
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        /* Source Serif 4 - for headings */
        @font-face {
          font-family: 'Source Serif 4';
          font-style: normal;
          font-display: swap;
          font-weight: 200 900;
          src: url('/fonts/Source_Serif_4/SourceSerif4-VariableFont_opsz,wght.ttf') format('truetype');
        }

        @font-face {
          font-family: 'Source Serif 4';
          font-style: italic;
          font-display: swap;
          font-weight: 200 900;
          src: url('/fonts/Source_Serif_4/SourceSerif4-Italic-VariableFont_opsz,wght.ttf') format('truetype');
        }
        
        /* Inter - for body text and most UI elements */
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-display: swap;
          font-weight: 100 900;
          src: url('/fonts/Inter/Inter-VariableFont_opsz,wght.ttf') format('truetype');
        }
        
        @font-face {
          font-family: 'Inter';
          font-style: italic;
          font-display: swap;
          font-weight: 100 900;
          src: url('/fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf') format('truetype');
        }
        
        /* IBM Plex Mono - for buttons */
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
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          letterSpacing: "0.02em",
        },
      },
    },
  },
});

export default sageTheme;
