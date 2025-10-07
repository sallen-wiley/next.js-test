"use client";
import { createTheme, Theme, Palette } from "@mui/material/styles";
import { lighten, darken } from "@mui/material/styles";
import * as colors from "./colors";

// Type augmentations for custom theme properties
declare module "@mui/material/styles" {
  interface Theme {
    // Custom theme properties (following MUI docs pattern)
    customPalette: {
      primaryLightest: string;
      secondaryLightest: string;
      errorLightest: string;
      warningLightest: string;
      infoLightest: string;
      successLightest: string;
    };
    // Add colorSchemes to Theme interface so we can access it in component overrides to support light/dark mode specific styles
    colorSchemes: {
      light: {
        palette: Palette;
      };
      dark: {
        palette: Palette;
      };
    };
  }

  // Allow configuration using `createTheme()`
  interface ThemeOptions {
    customPalette?: {
      primaryLightest?: string;
      secondaryLightest?: string;
      errorLightest?: string;
      warningLightest?: string;
      infoLightest?: string;
      successLightest?: string;
    };
  }
}

// Note: Button size overrides are now declared in global types.ts

// Wiley theme using Open Sans for a modern, professional academic look
// Using MUI's official theme composition pattern for theme-aware components

// Step 1: Create base theme with palette, typography, shape, etc.
let wileyTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class", // Enable manual mode switching
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 641,
      lg: 1081,
      xl: 1441,
    },
  },
  palette: {
    // Base palette configuration that applies to light mode and gets automatically adapted for dark mode
    contrastThreshold: 4.5, // WCAG AA compliant contrast threshold
    primary: {
      main: colors.blue[500],
      dark: colors.blue[800],
      light: colors.blue[400],
    },
    secondary: {
      main: colors.pink[500],
      dark: colors.pink[600],
      light: colors.pink[400],
    },
    error: {
      main: colors.red[500],
      dark: colors.red[700],
      light: colors.red[300],
    },
    warning: {
      main: colors.orange[500],
      dark: colors.orange[700],
      light: colors.orange[300],
    },
    info: {
      main: colors.blue[500],
      dark: colors.blue[800],
      light: colors.blue[400],
    },
    success: {
      main: colors.green[500],
      dark: colors.green[700],
      light: colors.green[300],
    },
    neutral: {
      main: colors.grey[800],
      light: lighten(colors.grey[800], 0.1),
      dark: darken(colors.grey[800], 0.1),
      contrastText: colors.common.white,
    },
    black: {
      main: colors.common.black,
      light: lighten(colors.common.black, 0.1),
      dark: darken(colors.common.black, 0.1),
      contrastText: colors.common.white,
    },
    white: {
      main: colors.common.white,
      light: lighten(colors.common.white, 0.1),
      dark: darken(colors.common.white, 0.1),
      contrastText: colors.common.black,
    },
  },
  colorSchemes: {
    dark: {
      palette: {
        // Only customize specific colors for dark mode
        // Everything else is automatically generated from your base palette
        background: {
          default: "#0A1929",
          paper: "#132F4C",
        },
        // Example: You could also customize specific brand colors for dark mode
        // primary: {
        //   main: '#64B5F6', // Lighter blue for dark mode
        // },
      },
    },
  },
  typography: {
    fontFamily: "'Open Sans'", // Modern, readable sans-serif
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.167,
      letterSpacing: "-0.01562em",
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.00833em",
    },
    h3: {
      fontSize: "2.125rem",
      fontWeight: 700,
      lineHeight: 1.167,
      letterSpacing: "0em",
    },
    h4: {
      fontSize: "1.75rem",
      fontWeight: 700,
      lineHeight: 1.286,
      letterSpacing: "0.00735em",
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 700,
      lineHeight: 1.334,
      letterSpacing: "0em",
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: "0.0075em",
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.75,
      letterSpacing: "0.00938em",
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.57,
      letterSpacing: "0.00714em",
    },
    body1: {
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem",
      lineHeight: 1.5,
      letterSpacing: "0.01071em",
    },
    button: {
      fontWeight: 600,
      fontSize: "0.875rem",
      lineHeight: 1.75,
      letterSpacing: "0.02857em",
      textTransform: "none",
    },
    caption: {
      fontWeight: 400,
      fontSize: "0.75rem",
      lineHeight: 1.66,
      letterSpacing: "0.03333em",
    },
    overline: {
      fontWeight: 400,
      fontSize: "0.75rem",
      lineHeight: 2.66,
      letterSpacing: "0.08333em",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 1, // Clean, modern corners
  },

  // Custom palette with lightest shades (following MUI docs pattern)
  customPalette: {
    primaryLightest: colors.blue[50],
    secondaryLightest: colors.pink[50],
    errorLightest: colors.red[50],
    warningLightest: colors.orange[50],
    infoLightest: colors.blue[50],
    successLightest: colors.green[50],
  },
});

// Step 2: Extend theme with component overrides that can access theme values
// supporting variables to help with calculations
const SHRUNK_LABEL_SCALE = 0.875; // MUI default is 0.75 - which is too small for Wiley's design system
const SHRUNK_LABEL_LINEHEIGHT = 1.5; // The line height of the shrunk label - we use this to translate the label and ensure it is vertically aligned with teh outlined input border. We need a lineheight larger than the font-size to prevent decenders from being hidden in the overflow

wileyTheme = createTheme(wileyTheme, {
  components: {
    // Static components (no theme access needed)
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Open Sans';
          font-style: normal;
          font-display: swap;
          font-weight: 100 900;
          src: url('/fonts/Open_Sans/OpenSans-VariableFont_wdth,wght.ttf') format('truetype');
        }

        @font-face {
          font-family: 'Open Sans';
          font-style: italic;
          font-display: swap;
          font-weight: 100 900;
          src: url('/fonts/Open_Sans/OpenSans-Italic-VariableFont_wdth,wght.ttf') format('truetype');
        }
      `,
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          "&.Mui-focusVisible": {
            outline: "2px solid",
            outlineOffset: "2px",
            // Color-specific styles that change with color scheme
            ...theme.applyStyles("light", {
              outlineColor: theme.palette.common.black,
            }),
            ...theme.applyStyles("dark", {
              outlineColor: theme.palette.common.white,
            }),
          },
          "&.Mui-focusVisibleOnDark:focus-visible": {
            outline: "2px solid white",
            outlineOffset: "2px",
          },
        }),
      },
    },

    // Theme-aware components (can access theme values)
    MuiChip: {
      styleOverrides: {
        label: {
          // Chip uses same font weight as buttons
          fontWeight: wileyTheme.typography.button.fontWeight,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        standardSuccess: ({ theme }: { theme: Theme }) => ({
          // Light mode custom colors, dark mode uses defaults
          ...theme.applyStyles("light", {
            backgroundColor: theme.customPalette.successLightest,
            color: theme.palette.text.primary,
          }),
        }),
        outlinedSuccess: ({ theme }: { theme: Theme }) => ({
          ...theme.applyStyles("light", {
            borderColor: theme.palette.success.main,
            color: theme.palette.success.main,
          }),
        }),
        standardError: ({ theme }: { theme: Theme }) => ({
          ...theme.applyStyles("light", {
            backgroundColor: theme.customPalette.errorLightest,
            color: theme.palette.text.primary,
          }),
        }),
        outlinedError: ({ theme }: { theme: Theme }) => ({
          ...theme.applyStyles("light", {
            borderColor: theme.palette.error.main,
            color: theme.palette.error.main,
          }),
        }),
        standardInfo: ({ theme }: { theme: Theme }) => ({
          ...theme.applyStyles("light", {
            backgroundColor: theme.customPalette.infoLightest,
            color: theme.palette.text.primary,
          }),
        }),
        outlinedInfo: ({ theme }: { theme: Theme }) => ({
          ...theme.applyStyles("light", {
            borderColor: theme.palette.info.main,
            color: theme.palette.info.main,
          }),
        }),
        standardWarning: ({ theme }: { theme: Theme }) => ({
          ...theme.applyStyles("light", {
            backgroundColor: theme.customPalette.warningLightest,
            color: theme.palette.text.primary,
          }),
        }),
        outlinedWarning: ({ theme }: { theme: Theme }) => ({
          ...theme.applyStyles("light", {
            borderColor: theme.palette.warning.main,
            color: theme.palette.warning.main,
          }),
        }),
      },
    },

    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "15px",
          paddingRight: "15px",
          "&.MuiContainer-disableGutters": {
            paddingLeft: 0,
            paddingRight: 0,
          },
          [wileyTheme.breakpoints.up("sm")]: {
            paddingLeft: "15px",
            paddingRight: "15px",
          },
          [wileyTheme.breakpoints.up("md")]: {
            paddingLeft: "15px",
            paddingRight: "15px",
          },
          [wileyTheme.breakpoints.up("lg")]: {
            paddingLeft: "15px",
            paddingRight: "15px",
          },
          [wileyTheme.breakpoints.up("xl")]: {
            paddingLeft: "15px",
            paddingRight: "15px",
          },
        },
        // Set container max-widths when 'Fixed' prop is used (Fixed should be used by default unless specified otherwise)
        fixed: {
          maxWidth: "100%",
          [wileyTheme.breakpoints.up("sm")]: {
            maxWidth: "100%",
          },
          [wileyTheme.breakpoints.up("md")]: {
            maxWidth: "100%",
          },
          [wileyTheme.breakpoints.up("lg")]: {
            maxWidth: "1290px",
          },
          [wileyTheme.breakpoints.up("xl")]: {
            maxWidth: "1630px",
          },
        },
        // If using fluid or 'fixed=false' containers, ensure container max-widths are same as fixed max-widths
        maxWidthLg: {
          [wileyTheme.breakpoints.up("lg")]: {
            maxWidth: "1290px",
          },
        },
        maxWidthXl: {
          [wileyTheme.breakpoints.up("xl")]: {
            maxWidth: "1630px",
          },
        },
      },
    },

    MuiTextField: {
      // Remove defaultProps that depend on JS timing - we'll handle this via CSS
    },

    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          // Force all labels to be in shrunk position via CSS
          // This ensures immediate application regardless of JS timing
          lineHeight: SHRUNK_LABEL_LINEHEIGHT,
          transform: `translate(14px, ${
            SHRUNK_LABEL_LINEHEIGHT * SHRUNK_LABEL_SCALE * -0.5 * 16 // 16px is the default font size in MUI, so we multiply by SHRUNK_LABEL_SCALE and SHRUNK_LABEL_LINEHEIGHT to get the correct translation
          }px) scale(${SHRUNK_LABEL_SCALE})`,
          transformOrigin: "top left",
          // Color-specific styles that change with color scheme
          ...theme.applyStyles("light", {
            color: theme.colorSchemes.light.palette.text.primary,
          }),
          ...theme.applyStyles("dark", {
            color: theme.colorSchemes.dark.palette.text.primary,
          }),
        }),
        outlined: {
          // Ensure consistent styling for outlined variant
          lineHeight: SHRUNK_LABEL_LINEHEIGHT,
          transform: `translate(14px, ${
            SHRUNK_LABEL_LINEHEIGHT * SHRUNK_LABEL_SCALE * -0.5 * 16
          }px) scale(${SHRUNK_LABEL_SCALE})`,
          transformOrigin: "top left",
        },
        filled: {
          // Ensure consistent styling for filled variant
          lineHeight: SHRUNK_LABEL_LINEHEIGHT,
          transform: `translate(12px, ${
            SHRUNK_LABEL_LINEHEIGHT * SHRUNK_LABEL_SCALE * -0.5 * 16 - 6 // Slightly different positioning for filled variant
          }px) scale(${SHRUNK_LABEL_SCALE})`,
          transformOrigin: "top left",
        },
        standard: {
          // Ensure consistent styling for standard variant
          lineHeight: SHRUNK_LABEL_LINEHEIGHT,
          transform: `translate(0, ${
            SHRUNK_LABEL_LINEHEIGHT * SHRUNK_LABEL_SCALE * -0.5 * 16 - 10 // Different positioning for standard variant
          }px) scale(${SHRUNK_LABEL_SCALE})`,
          transformOrigin: "top left",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // Styles for the root element
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
            // increase width to compensate for low contrast between Wiley dark blue and default border color
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: undefined, // or use theme.palette.action.hover if you want MUI's default
          },
        },
        notchedOutline: ({ theme }: { theme: Theme }) => ({
          // Color-specific styles that change with color scheme
          ...theme.applyStyles("light", {
            borderColor: theme.palette.text.secondary,
            // reuse the secondary text color for the border in light mode only
          }),
          // Dark mode uses default border color
          "& legend": {
            fontSize: `${SHRUNK_LABEL_SCALE}em`,
            // increase the font size of the invisible label used to 'notch' the outline. This should match the MuiInput Label transformation value
            maxWidth: "100%",
            // Force the legend to always show (as if label is always shrunk)
            // width: "auto",
          },
          // Always show the notch as if label is shrunk
          "& legend > span": {
            // paddingLeft: "5px",
            // paddingRight: "5px",
          },
        }),
      },
    },

    MuiPaginationItem: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          fontWeight: theme.typography.button.fontWeight,
          // Light mode custom colors, dark mode uses defaults
          ...theme.applyStyles("light", {
            "&.MuiPaginationItem-outlinedPrimary": {
              color: theme.palette.primary.main,
            },
            "&.MuiPaginationItem-textPrimary": {
              color: theme.palette.primary.main,
              "&.Mui-selected": {
                color: theme.palette.primary.contrastText,
              },
            },
          }),
        }),
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          // Variants for custom sizes
          variants: [
            {
              props: { size: "extraLarge" as const },
              style: {
                padding: "12px 32px",
                fontSize: "1.125rem",
                lineHeight: 1.5,
                minHeight: "56px",
                fontWeight: 600,
                "& .MuiButton-startIcon": {
                  marginLeft: 0,
                  marginRight: "12px",
                  "& > *:nth-of-type(1)": {
                    fontSize: "24px",
                  },
                },
                "& .MuiButton-endIcon": {
                  marginLeft: "12px",
                  marginRight: 0,
                  "& > *:nth-of-type(1)": {
                    fontSize: "24px",
                  },
                },
              },
            },
          ],
        },
        text: {
          textDecoration: "underline",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
  },
});

export default wileyTheme;
