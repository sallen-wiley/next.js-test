"use client";
import { createTheme, Theme, Palette } from "@mui/material/styles";
import { lighten, darken } from "@mui/material/styles";
import * as colors from "./colors";
import { designTokens } from "./brandTokens";

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

// Theme using Open Sans for a modern, professional academic look
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
      main: colors.lightGreen[700],
      dark: colors.green[700],
      light: colors.green[400],
      contrastText: colors.common.white,
    },
    secondary: {
      main: colors.blue[700],
      dark: colors.cyan[700],
      light: colors.blue[400],
    },
    error: {
      main: designTokens.colorPrimitives.system.errorRed[100], // #d0021b from design tokens
    },
    warning: {
      main: designTokens.colorPrimitives.system.alertYellow[100], // #fcb624 from design tokens
    },
    info: {
      main: designTokens.colorPrimitives.secondary.skyBlue[100], // #5ac4e4 from design tokens
    },
    success: {
      main: designTokens.colorPrimitives.system.successGreen[100], // #81ba40 from design tokens
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
    background: {
      default: colors.grey[100],
      paper: colors.common.white,
    },
  },
  colorSchemes: {
    dark: {
      palette: {
        background: {
          default: "#0A1929",
          paper: "#132F4C",
        },
      },
    },
  },
  typography: {
    fontFamily: "'Nunito'",

    // Map design tokens to MUI typography variants
    h1: {
      fontSize: `${designTokens.font.title.hero.fontSize}px`,
      fontWeight: designTokens.font.title.hero.fontWeight,
      lineHeight:
        designTokens.font.title.hero.lineHeight /
        designTokens.font.title.hero.fontSize,
      letterSpacing: `${designTokens.font.title.hero.letterSpacing}px`,
      textTransform:
        designTokens.font.title.hero.textCase === "uppercase"
          ? "uppercase"
          : "none",
    },
    h2: {
      fontSize: "2.5rem", // Keeping existing for design consistency
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.00833em",
    },
    h3: {
      fontSize: `${designTokens.font.title.primary.fontSize}px`,
      fontWeight: designTokens.font.title.primary.fontWeight,
      lineHeight:
        designTokens.font.title.primary.lineHeight /
        designTokens.font.title.primary.fontSize,
      letterSpacing: `${designTokens.font.title.primary.letterSpacing}px`,
      textTransform:
        designTokens.font.title.primary.textCase === "uppercase"
          ? "uppercase"
          : "none",
    },
    h4: {
      fontSize: "1.75rem", // Keeping existing for design consistency
      fontWeight: 700,
      lineHeight: 1.286,
      letterSpacing: "0.00735em",
    },
    h5: {
      fontSize: "1.5rem", // Keeping existing for design consistency
      fontWeight: 700,
      lineHeight: 1.334,
      letterSpacing: "0em",
    },
    h6: {
      fontSize: `${designTokens.font.title.small.fontSize}px`,
      fontWeight: designTokens.font.title.small.fontWeight,
      lineHeight:
        designTokens.font.title.small.lineHeight /
        designTokens.font.title.small.fontSize,
      letterSpacing: `${designTokens.font.title.small.letterSpacing}px`,
      textTransform:
        designTokens.font.title.small.textCase === "uppercase"
          ? "uppercase"
          : "none",
    },
    subtitle1: {
      fontSize: `${designTokens.font.label.bold.fontSize}px`,
      fontWeight: designTokens.font.label.bold.fontWeight,
      lineHeight:
        designTokens.font.label.bold.lineHeight /
        designTokens.font.label.bold.fontSize,
      letterSpacing: `${designTokens.font.label.bold.letterSpacing}px`,
      textTransform:
        designTokens.font.label.bold.textCase === "uppercase"
          ? "uppercase"
          : "none",
    },
    subtitle2: {
      fontSize: `${designTokens.font.label.regular.fontSize}px`,
      fontWeight: designTokens.font.label.regular.fontWeight,
      lineHeight:
        designTokens.font.label.regular.lineHeight /
        designTokens.font.label.regular.fontSize,
      letterSpacing: `${designTokens.font.label.regular.letterSpacing}px`,
      textTransform:
        designTokens.font.label.regular.textCase === "uppercase"
          ? "uppercase"
          : "none",
    },
    body1: {
      fontSize: `${designTokens.font.paragraph.primary.fontSize}px`,
      fontWeight: designTokens.font.paragraph.primary.fontWeight,
      lineHeight:
        designTokens.font.paragraph.primary.lineHeight /
        designTokens.font.paragraph.primary.fontSize,
      letterSpacing: `${designTokens.font.paragraph.primary.letterSpacing}px`,
      textTransform:
        designTokens.font.paragraph.primary.textCase === "uppercase"
          ? "uppercase"
          : "none",
    },
    body2: {
      fontSize: `${designTokens.font.paragraph.message.fontSize}px`,
      fontWeight: designTokens.font.paragraph.message.fontWeight,
      lineHeight:
        designTokens.font.paragraph.message.lineHeight /
        designTokens.font.paragraph.message.fontSize,
      letterSpacing: `${designTokens.font.paragraph.message.letterSpacing}px`,
      textTransform:
        designTokens.font.paragraph.message.textCase === "uppercase"
          ? "uppercase"
          : "none",
    },
    button: {
      fontSize: `${designTokens.font.button.large.fontSize}px`,
      fontWeight: designTokens.font.button.large.fontWeight,
      lineHeight:
        designTokens.font.button.large.lineHeight /
        designTokens.font.button.large.fontSize,
      letterSpacing: `${designTokens.font.button.large.letterSpacing}px`,
      textTransform:
        designTokens.font.button.large.textCase === "uppercase"
          ? "uppercase"
          : "none",
    },
    caption: {
      fontSize: `${designTokens.font.indicator.small.fontSize}px`,
      fontWeight: designTokens.font.indicator.small.fontWeight,
      lineHeight:
        designTokens.font.indicator.small.lineHeight /
        designTokens.font.indicator.small.fontSize,
      letterSpacing: `${designTokens.font.indicator.small.letterSpacing}px`,
      textTransform:
        designTokens.font.indicator.small.textCase === "uppercase"
          ? "uppercase"
          : "none",
    },
    overline: {
      fontSize: `${designTokens.font.label.small.fontSize}px`,
      fontWeight: designTokens.font.label.small.fontWeight,
      lineHeight:
        designTokens.font.label.small.lineHeight /
        designTokens.font.label.small.fontSize,
      letterSpacing: `${designTokens.font.label.small.letterSpacing}px`,
      textTransform:
        designTokens.font.label.small.textCase === "uppercase"
          ? "uppercase"
          : "none",
    },
  },
  shape: {
    borderRadius: 4,
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
const SHRUNK_LABEL_SCALE = 0.875; // MUI default is 0.75 - which is too small for this design system
const SHRUNK_LABEL_LINEHEIGHT = 1.5; // The line height of the shrunk label - we use this to translate the label and ensure it is vertically aligned with teh outlined input border. We need a lineheight larger than the font-size to prevent decenders from being hidden in the overflow

theme = createTheme(theme, {
  components: {
    // Static components (no theme access needed)
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Nunito';
          font-style: normal;
          font-display: swap;
          font-weight: 100 900;
          src: url('/fonts/Nunito/Nunito-VariableFont_wght.ttf') format('truetype');
        }

        @font-face {
          font-family: 'Nunito';
          font-style: italic;
          font-display: swap;
          font-weight: 100 900;
          src: url('/fonts/Nunito/Nunito-Italic-VariableFont_wght.ttf') format('truetype');
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
        root: {
          // Use theme shape border radius instead of default fully rounded
          borderRadius: theme.shape.borderRadius,
        },
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
            // increase width to compensate for low contrast between dark blue and default border color
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

export default theme;
