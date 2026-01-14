"use client";
import { createTheme, Theme, Palette } from "@mui/material/styles";
import * as brandColors from "./brandColors";

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

// Theme using Inter for a modern, clean Research Exchange look
// Using MUI's official theme composition pattern for theme-aware components

// Step 1: Create base theme with palette, typography, shape, etc.
let theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data", // Enable manual mode switching
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
      main: brandColors.brandColors["Primary Heritage"][700],
    },
    secondary: {
      main: brandColors.brandColors["Primary Heritage"][900],
    },
    error: {
      main: brandColors.brandColors["System Negative"][600],
    },
    warning: {
      main: brandColors.brandColors["System Alert"][800],
    },
    info: {
      main: brandColors.brandColors["Primary Heritage"][700],
    },
    success: {
      main: brandColors.brandColors["System Positive"][700],
    },
    // Custom brand colors using color objects
    neutral: {
      main: brandColors.brandColors.Neutral[700],
      light: brandColors.brandColors.Neutral[600],
      dark: brandColors.brandColors.Neutral[800],
      contrastText: brandColors.brandColors.Neutral[50],
    },
    black: {
      main: "#000000",
      light: brandColors.brandColors.Neutral[600],
      dark: brandColors.brandColors.Neutral[800],
      contrastText: brandColors.brandColors.Neutral[50],
    },
    white: {
      main: "#FFFFFF",
      light: brandColors.brandColors.Neutral[100],
      dark: brandColors.brandColors.Neutral[400],
      contrastText: brandColors.brandColors.Neutral[900],
    },
    text: {
      primary: brandColors.brandColors.Neutral[900],
      secondary: brandColors.brandColors.Neutral[800],
      disabled: brandColors.brandColors.Neutral[700],
    },
    background: {
      default: "#ffffff",
      paper: brandColors.brandColors.Neutral[50],
    },
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: brandColors.brandColors["Primary Heritage"][300],
          contrastText: brandColors.brandColors["Primary Heritage"][900],
        },
        secondary: {
          main: brandColors.brandColors["Primary Heritage"][100],
          contrastText: brandColors.brandColors["Primary Heritage"][900],
        },
        background: {
          default: "#000000",
          paper: brandColors.brandColors.Neutral[800],
        },
        text: {
          primary: brandColors.brandColors.Neutral[50],
          secondary: brandColors.brandColors.Neutral[100],
          disabled: brandColors.brandColors.Neutral[300],
        },
      },
    },
  },
  typography: {
    fontFamily: "'Inter'", // Use Inter for Research Exchange
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
      fontFamily: "'Inter'", // Use Inter for buttons (changed from IBM Plex Mono)
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.75,
      letterSpacing: "0.02857em",
      textTransform: "uppercase",
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
    borderRadius: 4,
  },

  // Custom palette with lightest shades (following MUI docs pattern)
  customPalette: {
    primaryLightest: brandColors.brandColors["Primary Heritage"][50],
    secondaryLightest: brandColors.brandColors["Primary Heritage"][50],
    errorLightest: brandColors.brandColors["System Negative"][50],
    warningLightest: brandColors.brandColors["System Alert"][50],
    infoLightest: brandColors.brandColors["Primary Heritage"][50],
    successLightest: brandColors.brandColors["System Positive"][50],
  },
});

// Step 2: Extend theme with component overrides that can access theme values
// supporting variables to help with calculations
// const SHRUNK_LABEL_SCALE = 0.875; // MUI default is 0.75 - which is too small for this design system
// const SHRUNK_LABEL_LINEHEIGHT = 1.5; // The line height of the shrunk label - we use this to translate the label and ensure it is vertically aligned with teh outlined input border. We need a lineheight larger than the font-size to prevent decenders from being hidden in the overflow

theme = createTheme(theme, {
  components: {
    // Static components (no theme access needed)
    MuiCssBaseline: {
      styleOverrides: `
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
          fontWeight: theme.typography.button.fontWeight,
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
        root: ({ theme }: { theme: Theme }) => ({
          paddingLeft: "15px",
          paddingRight: "15px",
          "&.MuiContainer-disableGutters": {
            paddingLeft: 0,
            paddingRight: 0,
          },
          [theme.breakpoints.up("sm")]: {
            paddingLeft: "15px",
            paddingRight: "15px",
          },
          [theme.breakpoints.up("md")]: {
            paddingLeft: "15px",
            paddingRight: "15px",
          },
          [theme.breakpoints.up("lg")]: {
            paddingLeft: "15px",
            paddingRight: "15px",
          },
          [theme.breakpoints.up("xl")]: {
            paddingLeft: "15px",
            paddingRight: "15px",
          },
        }),
        // Set container max-widths when 'Fixed' prop is used (Fixed should be used by default unless specified otherwise)
        fixed: ({ theme }: { theme: Theme }) => ({
          maxWidth: "100%",
          [theme.breakpoints.up("sm")]: {
            maxWidth: "100%",
          },
          [theme.breakpoints.up("md")]: {
            maxWidth: "100%",
          },
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1290px",
          },
          [theme.breakpoints.up("xl")]: {
            maxWidth: "1630px",
          },
        }),
        // If using fluid or 'fixed=false' containers, ensure container max-widths are same as fixed max-widths
        maxWidthLg: ({ theme }: { theme: Theme }) => ({
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1290px",
          },
        }),
        maxWidthXl: ({ theme }: { theme: Theme }) => ({
          [theme.breakpoints.up("xl")]: {
            maxWidth: "1630px",
          },
        }),
      },
    },
    MuiTextField: {
      // Remove defaultProps that depend on JS timing - we'll handle this via CSS
    },

    MuiInputLabel: {
      defaultProps: {
        // Force shrink to prevent label animation
        shrink: true,
      },
      styleOverrides: {
        outlined: ({ theme }: { theme: Theme }) => ({
          // Position label above and outside the input
          position: "relative", // Change from absolute
          transform: "none", // Remove transform entirely
          marginBottom: theme.spacing(1), // Space between label and input
          fontSize: theme.typography.body2.fontSize, // Normal label size
          fontWeight: theme.typography.fontWeightMedium,

          ...theme.applyStyles("light", {
            color: theme.colorSchemes.light.palette.text.primary,
          }),
          ...theme.applyStyles("dark", {
            color: theme.colorSchemes.dark.palette.text.primary,
          }),

          // Remove shrunk state styling since we're not using it
          "&.MuiInputLabel-shrink": {
            transform: "none",
          },
        }),
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          ".MuiOutlinedInput-notchedOutline": {
            top: 0,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
          },
        },
        notchedOutline: ({ theme }: { theme: Theme }) => ({
          ...theme.applyStyles("light", {
            borderColor: theme.palette.text.secondary,
          }),

          // Remove the notch entirely since label is no longer inside
          "& legend": {
            display: "none", // Hide the legend element
          },
        }),
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0, // Align helper text with input border
        },
      },
    },

    // You'll also need to adjust FormControl to handle the new label positioning
    MuiFormControl: {
      styleOverrides: {
        root: {
          // Ensure proper layout with external label
          display: "flex",
          flexDirection: "column",
        },
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

export default theme;
