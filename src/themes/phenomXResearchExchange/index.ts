"use client";
import { createTheme, Theme, Palette } from "@mui/material/styles";
import { lighten, darken } from "@mui/material/styles";
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

// Theme using Inter for Phenom X Research Exchange
// Modern, clean design with teal primary colors

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
      main: designTokens.colorPrimitives.primary.teal[700],
    },
    secondary: {
      main: designTokens.colorPrimitives.primary.teal[900],
    },
    error: {
      main: designTokens.colorPrimitives.system.errorRed[600],
    },
    warning: {
      main: designTokens.colorPrimitives.secondary.yellow[800],
    },
    info: {
      main: designTokens.colorPrimitives.primary.teal[600],
    },
    success: {
      main: designTokens.colorPrimitives.secondary.green[700],
    },
    neutral: {
      main: designTokens.colorPrimitives.neutral.grey80,
      light: lighten(designTokens.colorPrimitives.neutral.grey80, 0.1),
      dark: darken(designTokens.colorPrimitives.neutral.grey80, 0.1),
      contrastText: designTokens.colorPrimitives.neutral.white,
    },
    black: {
      main: designTokens.colorPrimitives.neutral.grey90,
      light: lighten(designTokens.colorPrimitives.neutral.grey90, 0.1),
      dark: darken(designTokens.colorPrimitives.neutral.grey90, 0.1),
      contrastText: designTokens.colorPrimitives.neutral.white,
    },
    white: {
      main: designTokens.colorPrimitives.neutral.white,
      light: lighten(designTokens.colorPrimitives.neutral.white, 0.1),
      dark: darken(designTokens.colorPrimitives.neutral.white, 0.1),
      contrastText: designTokens.colorPrimitives.neutral.grey90,
    },
    background: {
      default: designTokens.colorPrimitives.neutral.grey20,
      paper: designTokens.colorPrimitives.neutral.white,
    },
    text: {
      primary: designTokens.colorPrimitives.neutral.grey90,
      secondary: designTokens.colorPrimitives.neutral.grey70,
      disabled: designTokens.colorPrimitives.neutral.grey50,
    },
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: designTokens.colorPrimitives.primary.teal[500],
          dark: designTokens.colorPrimitives.primary.teal[700],
          light: designTokens.colorPrimitives.primary.teal[300],
        },
        secondary: {
          main: designTokens.colorPrimitives.primary.teal[700],
          dark: designTokens.colorPrimitives.primary.teal[900],
          light: designTokens.colorPrimitives.primary.teal[500],
        },
        error: {
          main: designTokens.colorPrimitives.system.errorRed[400],
        },
        warning: {
          main: designTokens.colorPrimitives.secondary.yellow[500],
        },
        info: {
          main: designTokens.colorPrimitives.primary.teal[400],
        },
        success: {
          main: designTokens.colorPrimitives.secondary.green[500],
        },
        neutral: {
          main: designTokens.colorPrimitives.neutral.grey40,
          light: lighten(designTokens.colorPrimitives.neutral.grey40, 0.1),
          dark: darken(designTokens.colorPrimitives.neutral.grey40, 0.1),
          contrastText: designTokens.colorPrimitives.neutral.grey90,
        },
        black: {
          main: designTokens.colorPrimitives.neutral.grey90,
          light: lighten(designTokens.colorPrimitives.neutral.grey90, 0.1),
          dark: darken(designTokens.colorPrimitives.neutral.grey90, 0.1),
          contrastText: designTokens.colorPrimitives.neutral.white,
        },
        white: {
          main: designTokens.colorPrimitives.neutral.white,
          light: lighten(designTokens.colorPrimitives.neutral.white, 0.1),
          dark: darken(designTokens.colorPrimitives.neutral.white, 0.1),
          contrastText: designTokens.colorPrimitives.neutral.grey90,
        },
        background: {
          default: "#121212", // MUI dark mode default
          paper: "#1e1e1e", // Slightly lighter than default
        },
        text: {
          primary: "rgba(255, 255, 255, 0.87)", // MUI dark mode default
          secondary: "rgba(255, 255, 255, 0.6)", // MUI dark mode default
          disabled: "rgba(255, 255, 255, 0.38)", // MUI dark mode default
        },
      },
    },
  },
  typography: {
    fontFamily: "'Inter'",

    // Map design tokens to MUI typography variants
    // Using Wiley theme sizes for h1-h3 to maintain consistent layouts across themes
    // PDS heading styles (Title-Hero, Title-Primary, Title-Small) mapped to h4-h6
    h1: {
      fontSize: "3rem", // 48px - matches wiley theme for layout consistency
      fontWeight: 700,
      lineHeight: 1.167,
      letterSpacing: "-0.01562em",
    },
    h2: {
      fontSize: "2.5rem", // 40px - matches wiley theme for layout consistency
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.00833em",
    },
    h3: {
      fontSize: "2.125rem", // 34px - matches wiley theme for layout consistency
      fontWeight: 700,
      lineHeight: 1.167,
      letterSpacing: "0em",
    },
    // Figma Text Style: Title-Hero (Bold, 30pt, Grey 70)
    h4: {
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
    // Figma Text Style: Title-Primary (Bold, 20pt, Grey 70)
    h5: {
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
    // Figma Text Style: Title-Small (Bold, 16pt, Grey 70)
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
    // Figma Text Style: Label-Bold (Bold, 14pt, Grey 70)
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
    // Figma Text Style: Label-Regular (Regular, 14pt, Grey 70)
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
    // Figma Text Style: Paragraph-Primary (Regular, 14pt, Grey 70)
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
    // Figma Text Style: Paragraph-Message (Regular, 12pt)
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
    // Figma Text Style: Button-Large (Bold, 14pt, uppercase)
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
    // Small indicator text (not a direct Figma mapping)
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
    // Figma Text Style: Label-Small (Bold, 11pt, uppercase)
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
    primaryLightest: designTokens.colorPrimitives.primary.teal[50],
    secondaryLightest: designTokens.colorPrimitives.primary.teal[50],
    errorLightest: designTokens.colorPrimitives.system.errorRed[50],
    warningLightest: designTokens.colorPrimitives.secondary.yellow[50],
    infoLightest: designTokens.colorPrimitives.primary.teal[50],
    successLightest: designTokens.colorPrimitives.secondary.green[50],
  },
});

// Step 2: Extend theme with component overrides that can access theme values

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
            outlineColor: theme.palette.common.black,

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
        root: ({
          ownerState,
        }: {
          ownerState: { onClick?: unknown; onDelete?: unknown };
        }) => {
          // Detect if this is a Pill (interactive) vs Tag (display)
          // Pills have onClick or onDelete handlers, Tags don't
          const isPill = !!(ownerState.onClick || ownerState.onDelete);

          // Base styles for Tags (non-interactive)
          const tagStyles = {
            textTransform: "uppercase" as const,
            height: "20px",
            fontSize: "11px",
            lineHeight: "12px",
            borderRadius: "2px",
          };

          // Pills (interactive) have different styling
          const pillStyles = {
            textTransform: "none" as const,
            height: "24px",
            fontSize: "14px",
            lineHeight: "16px",
            borderRadius: "12px",
          };

          return isPill ? pillStyles : tagStyles;
        },
        label: ({
          ownerState,
        }: {
          ownerState: { onClick?: unknown; onDelete?: unknown };
        }) => {
          const isPill = !!(ownerState.onClick || ownerState.onDelete);

          return {
            // Chip uses same font weight as buttons
            fontWeight: theme.typography.button.fontWeight,
            padding: isPill ? "4px 12px" : "4px 8px",
          };
        },
        sizeSmall: ({
          ownerState,
        }: {
          ownerState: { onClick?: unknown; onDelete?: unknown };
        }) => {
          const isPill = !!(ownerState.onClick || ownerState.onDelete);

          // Small tags are 16px, small pills are 20px
          return {
            height: isPill ? "20px" : "16px",
            fontSize: "11px",
            lineHeight: "12px",
            borderRadius: isPill ? "10px" : "2px",
            "& .MuiChip-label": {
              padding: isPill ? "4px 8px" : "4px",
            },
          };
        },
      },
      variants: [
        {
          props: { variant: "solid-light" },
          style: ({
            theme,
            ownerState,
          }: {
            theme: Theme;
            ownerState: { color?: string };
          }) => {
            const color = ownerState.color || "default";

            // Get the palette colors for both modes
            const lightPalette =
              color === "default"
                ? theme.palette.primary
                : (theme.palette[color as keyof typeof theme.palette] as
                    | { main?: string }
                    | undefined) || theme.palette.primary;

            const darkPalette =
              color === "default"
                ? theme.colorSchemes.dark.palette.primary
                : (theme.colorSchemes.dark.palette[
                    color as keyof typeof theme.colorSchemes.dark.palette
                  ] as { main?: string } | undefined) ||
                  theme.colorSchemes.dark.palette.primary;

            return {
              // Light mode: very light background with main color text
              backgroundColor: lighten(lightPalette.main!, 0.9),
              color: lightPalette.main,
              border: "none",

              "&:hover": {
                backgroundColor: lighten(lightPalette.main!, 0.85),
              },
              "&:focus": {
                backgroundColor: lighten(lightPalette.main!, 0.85),
              },

              // Dark mode: slightly darkened background with lighter text
              ...theme.applyStyles("dark", {
                backgroundColor: darken(darkPalette.main!, 0.6),
                color: lighten(darkPalette.main!, 0.3),
                "&:hover": {
                  backgroundColor: darken(darkPalette.main!, 0.5),
                },
                "&:focus": {
                  backgroundColor: darken(darkPalette.main!, 0.5),
                },
              }),
            };
          },
        },
      ],
    },

    MuiRadio: {
      styleOverrides: {
        root: ({
          theme,
          ownerState,
        }: {
          theme: Theme;
          ownerState: { color?: string };
        }) => {
          // Get the color from ownerState (default to 'primary')
          const radioColor = ownerState.color || "primary";

          // Get light and dark mode colors from colorSchemes
          const lightPalette =
            radioColor === "default"
              ? theme.palette.primary
              : (theme.palette[radioColor as keyof typeof theme.palette] as
                  | {
                      main?: string;
                    }
                  | undefined) || theme.palette.primary;

          const darkPalette =
            radioColor === "default"
              ? theme.colorSchemes.dark.palette.primary
              : (theme.colorSchemes.dark.palette[
                  radioColor as keyof typeof theme.colorSchemes.dark.palette
                ] as { main?: string } | undefined) ||
                theme.colorSchemes.dark.palette.primary;

          return {
            // Phenom: Radio border uses grey colors, NOT color prop
            // Default unchecked state (light mode default)
            color: designTokens.colorPrimitives.neutral.grey40, // #bdbdbd

            // Dark mode override
            ...theme.applyStyles("dark", {
              color: designTokens.colorPrimitives.neutral.grey60,
            }),

            // Hover state: darker grey border
            "&:hover": {
              color: designTokens.colorPrimitives.neutral.grey70, // #4f4f4f
              backgroundColor: "transparent", // Remove hover background

              ...theme.applyStyles("dark", {
                color: designTokens.colorPrimitives.neutral.grey40,
              }),
            },

            // Checked state: border stays grey, inner dot uses color prop
            "&.Mui-checked": {
              color: designTokens.colorPrimitives.neutral.grey40, // #bdbdbd - border color

              ...theme.applyStyles("dark", {
                color: designTokens.colorPrimitives.neutral.grey60,
              }),

              // The outer circle border (first SVG icon)
              "& .MuiSvgIcon-root:first-of-type": {
                color: designTokens.colorPrimitives.neutral.grey40, // #bdbdbd

                ...theme.applyStyles("dark", {
                  color: designTokens.colorPrimitives.neutral.grey60,
                }),
              },

              // The inner dot (second SVG icon) - uses color prop with mode-specific values
              "& .MuiSvgIcon-root:last-of-type": {
                color: lightPalette.main,

                ...theme.applyStyles("dark", {
                  color: darkPalette.main,
                }),
              },

              // Checked + hover: darker grey border
              "&:hover": {
                color: designTokens.colorPrimitives.neutral.grey70, // #4f4f4f
                backgroundColor: "transparent",

                ...theme.applyStyles("dark", {
                  color: designTokens.colorPrimitives.neutral.grey40,
                }),

                // Keep outer circle grey on hover
                "& .MuiSvgIcon-root:first-of-type": {
                  color: designTokens.colorPrimitives.neutral.grey70, // #4f4f4f

                  ...theme.applyStyles("dark", {
                    color: designTokens.colorPrimitives.neutral.grey40,
                  }),
                },

                // Keep inner dot colored on hover with mode-specific values
                "& .MuiSvgIcon-root:last-of-type": {
                  color: lightPalette.main,

                  ...theme.applyStyles("dark", {
                    color: darkPalette.main,
                  }),
                },
              },
            },

            // Disabled state
            "&.Mui-disabled": {
              color: designTokens.colorPrimitives.neutral.grey40, // #bdbdbd

              ...theme.applyStyles("dark", {
                color: designTokens.colorPrimitives.neutral.grey60,
              }),

              // Disabled checked state - both circle and dot are grey
              "&.Mui-checked": {
                "& .MuiSvgIcon-root": {
                  color: designTokens.colorPrimitives.neutral.grey40, // #bdbdbd

                  ...theme.applyStyles("dark", {
                    color: designTokens.colorPrimitives.neutral.grey60,
                  }),
                },
              },
            },
          };
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
          fontSize: "14px",
          lineHeight: "16px",
          fontWeight: theme.typography.fontWeightBold,
          color: theme.palette.text.primary,

          ...theme.applyStyles("dark", {
            color: theme.colorSchemes.dark.palette.text.primary,
          }),

          // Remove shrunk state styling since we're not using it
          "&.MuiInputLabel-shrink": {
            transform: "none",
          },

          // Phenom: Label stays primary text color on focus (no color change)
          "&.Mui-focused": {
            color: theme.palette.text.primary,

            ...theme.applyStyles("dark", {
              color: theme.colorSchemes.dark.palette.text.primary,
            }),
          },
        }),
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          ".MuiOutlinedInput-notchedOutline": {
            top: 0,
          },

          // Phenom: Focus border turns to primary text color (black/white)
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
            borderColor: theme.palette.text.primary,

            ...theme.applyStyles("dark", {
              borderColor: theme.colorSchemes.dark.palette.text.primary,
            }),
          },

          // Phenom: Hover border turns to primary text color
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.primary,

            ...theme.applyStyles("dark", {
              borderColor: theme.colorSchemes.dark.palette.text.primary,
            }),
          },
        }),
        inputSizeSmall: {
          paddingTop: "6px",
          paddingBottom: "6px",
        },
        notchedOutline: ({ theme }: { theme: Theme }) => ({
          borderColor: theme.palette.text.secondary,

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

    MuiPaginationItem: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          fontWeight: theme.typography.button.fontWeight,
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
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          fontWeight: designTokens.font.button.link.fontWeight, // 600 (semibold)
          cursor: "pointer",
        },
      },
      defaultProps: {
        underline: "always", // Phenom design shows always underlined
      },
    },

    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          // Breadcrumb links should use regular font weight, not semibold
          "& .MuiLink-root": {
            fontWeight: "400 !important", // Regular weight for breadcrumb links
          },
          // Ensure all breadcrumb links (regardless of color prop) use regular weight
          "& a": {
            fontWeight: "400 !important",
          },
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          // Only apply to Typography within breadcrumbs
          ".MuiBreadcrumbs-root &": {
            fontWeight: "700 !important", // Bold for current item
            fontSize: "14px !important",
            lineHeight: "16px !important",
            textTransform: "uppercase !important",
            color: designTokens.colorPrimitives.neutral.grey80,

            ...theme.applyStyles("dark", {
              color: theme.colorSchemes.dark.palette.text.primary,
            }),
          },
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
        sizeSmall: {
          textTransform: "none",
          fontSize: "0.875rem",
        },
        outlinedNeutral: {
          "&:not(:hover):not(:focus):not(:active):not(.Mui-focusVisible)": {
            backgroundColor: "#fff",
          },
        },
        text: {
          // textDecoration: "underline",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
  },
});

export default theme;
