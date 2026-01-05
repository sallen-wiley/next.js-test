"use client";
import { createTheme } from "@mui/material/styles";

// ReX Components theme using Open Sans and design tokens from Figma
const rexTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data", // Enable manual mode switching
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#005274", // neutral.main
          light: "#3D7C93",
          dark: "#003952",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#115C36", // success.main
          light: "#3A7E59",
          dark: "#0A3D24",
          contrastText: "#FFFFFF",
        },
        error: {
          main: "#BA0517", // danger.main
          light: "#C83746",
          dark: "#8A0311",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#734D00", // warning.main
          light: "#8F7033",
          dark: "#523700",
          contrastText: "#FFFFFF",
        },
        info: {
          main: "#005274", // information.main (same as neutral)
          light: "#3D7C93",
          dark: "#003952",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#115C36",
          light: "#3A7E59",
          dark: "#0A3D24",
          contrastText: "#FFFFFF",
        },
        neutral: {
          main: "#005274",
          light: "#3D7C93",
          dark: "#003952",
          contrastText: "#FFFFFF",
        },
        background: {
          default: "#FFFFFF",
          paper: "#F9F9F9",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#595959",
        },
        divider: "#CCCCCC",
        // Attention color for special cases
        attention: {
          main: "#CC4E00",
          light: "#D97233",
          dark: "#993A00",
          contrastText: "#FFFFFF",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#3D7C93",
          light: "#70A8BD",
          dark: "#005274",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#3A7E59",
          light: "#6BAA83",
          dark: "#115C36",
          contrastText: "#FFFFFF",
        },
        error: {
          main: "#C83746",
          light: "#E0697A",
          dark: "#BA0517",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#8F7033",
          light: "#B59866",
          dark: "#734D00",
          contrastText: "#FFFFFF",
        },
        info: {
          main: "#3D7C93",
          light: "#70A8BD",
          dark: "#005274",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#3A7E59",
          light: "#6BAA83",
          dark: "#115C36",
          contrastText: "#FFFFFF",
        },
        neutral: {
          main: "#3D7C93",
          light: "#70A8BD",
          dark: "#005274",
          contrastText: "#FFFFFF",
        },
        background: {
          default: "#121212",
          paper: "#1E1E1E",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#CCCCCC",
        },
        divider: "#595959",
        attention: {
          main: "#D97233",
          light: "#E59966",
          dark: "#CC4E00",
          contrastText: "#FFFFFF",
        },
      },
    },
  },
  typography: {
    fontFamily: "'Open Sans', 'Helvetica', 'Arial', sans-serif",

    // Main title: 25px, regular
    h1: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "25px",
      fontWeight: 400,
      lineHeight: 1.3,
    },

    // Subtitle: 20px, semibold
    h2: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "20px",
      fontWeight: 600,
      lineHeight: 1.35,
    },

    // Item title: 20px, regular
    h3: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "20px",
      fontWeight: 400,
      lineHeight: 1.4,
    },

    // Intermediate sizes
    h4: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "18px",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "14px",
      fontWeight: 600,
      lineHeight: 1.5,
    },

    // Text: 14px, regular
    body1: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "13px",
      fontWeight: 400,
      lineHeight: 1.5,
    },

    // Button: 14px, semibold
    button: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "14px",
      fontWeight: 600,
      textTransform: "none",
      lineHeight: 1.5,
    },

    subtitle1: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "14px",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: 1.5,
    },

    caption: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: 1.4,
    },
    overline: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "11px",
      fontWeight: 600,
      lineHeight: 1.4,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
  },
  shape: {
    borderRadius: 4, // Standard border radius
  },
  spacing: 5, // Base spacing unit (5px)
  // Named spacing scale:
  // 1 (5px)  = inline - text elements (text↔legend, label↔helper)
  // 2 (10px) = component - pieces within same component (title↔field, pill↔pill)
  // 3 (15px) = sibling - related elements (fields, items, paragraphs)
  // 6 (30px) = group - distinct sections (item groups, step sections)
  // 12 (60px) = layout - major layout divisions (header↔content, footer)
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        /* Open Sans - for all text */
        @font-face {
          font-family: 'Open Sans';
          font-style: normal;
          font-display: swap;
          font-weight: 300 800;
          src: url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default rexTheme;
