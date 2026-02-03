"use client";
import { createTheme } from "@mui/material/styles";
import { CSSProperties } from "react";

// ============================================================================
// DESIGN TOKENS - Color Palette
// ============================================================================

export const blue = {
  100: "#123D80",
  80: "#0056B6",
  40: "#9BC8ED",
  10: "#E6F1FB",
  5: "#F3F8FD",
};

export const grey = {
  90: "#1A1A1A",
  80: "#333333",
  70: "#4F4F4F",
  "60a": "#686868",
  "50a": "#949494",
  50: "#A6A6A6",
  40: "#BDBDBD",
  30: "#E0E0E0",
  20: "#F5F5F5",
  10: "#FAFAFA",
};

export const yellow = {
  100: "#FFC805",
  40: "#FA8A0F",
  20: "#FFF4CD",
  10: "#FFFAE6",
};

export const orange = {
  80: "#C65301",
  40: "#FA8A0F",
  20: "#FFF0E8",
};

export const red = {
  100: "#B72D2D",
  50: "#ED8A8A",
  10: "#FFE8E8",
};

export const green = {
  100: "#115C36",
  80: "#A6CE39",
  50: "#87BEA2",
  10: "#F1F6EB",
};

export const lilac = {
  100: "#941E66",
  50: "#FF91AA",
  10: "#F8DCE2",
};

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

// Spacing utility (if not imported from elsewhere, define locally)
const spacing = (factor: number) => `${factor * 8}px`;

const primitives = {
  fontFamily: "Open Sans",
  "text-3x-sm": {
    fontWeight: 600,
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: "130%",
    letterSpacing: "0.14px",
    fontFamily: "Open Sans",
    color: grey[90],
  },
  "text-2x-sm": {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: "130%",
    letterSpacing: "0.28px",
    fontFamily: "Open Sans",
    color: grey[90],
  },
  "text-1x-sm": {
    fontWeight: 700,
    fontSize: 15,
    lineHeight: "130%",
    letterSpacing: "0.28px",
    fontFamily: "Open Sans",
    color: grey[90],
  },
  "text-sm": {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: "130%",
    letterSpacing: "0.32px",
    fontFamily: "Open Sans",
    color: grey[90],
  },
  "text-default": {
    fontWeight: 400,
    fontSize: 16,
    lineHeight: "130%",
    letterSpacing: "0.16px",
    fontFamily: "Open Sans",
    color: "#000000",
  },
  "text-lg": {
    fontWeight: 600,
    fontSize: 18,
    lineHeight: "130%",
    letterSpacing: "0.36px",
    fontFamily: "Open Sans",
    color: grey[90],
  },
  "text-1x-lg": {
    fontWeight: 600,
    fontSize: 20,
    lineHeight: "130%",
    letterSpacing: "0.4px",
    fontFamily: "Open Sans",
    color: grey[90],
  },
  "text-2x-lg": {
    fontWeight: 600,
    fontSize: 24,
    lineHeight: "130%",
    letterSpacing: "0.48px",
    fontFamily: "Open Sans",
    color: grey[90],
  },
  "text-3x-lg": {
    fontWeight: 400,
    fontSize: 26,
    lineHeight: "130%",
    letterSpacing: "0.52px",
    fontFamily: "Open Sans",
    color: grey[90],
  },
};

const tableData = {
  ...primitives["text-3x-sm"],
  fontStyle: "normal",
  fontWeight: 400,
  "@media (max-width:600px)": {
    color: "#000000",
    fontSize: 15,
  },
};

const formData = {
  ...primitives["text-2x-sm"],
  fontWeight: 400,
  color: "#000000",
  "@media (max-width:600px)": {
    fontSize: 16,
  },
};

export const defaultText = {
  ...primitives["text-2x-sm"],
  fontWeight: 400,
};

const typography = {
  "page-title": {
    ...primitives["text-3x-lg"],
  },
  "item-title": {
    ...primitives["text-2x-lg"],
  },
  "text-title-1": {
    ...primitives["text-1x-lg"],
    "@media (max-width:600px)": {
      fontSize: 22,
    },
  },
  "text-title-2": {
    ...primitives["text-lg"],
  },
  "text-title-3": {
    ...primitives["text-sm"],
  },
  "text-title-4": {
    ...primitives["text-1x-sm"],
  },
  "text-title-5": {
    ...primitives["text-2x-sm"],
  },
  "text-title-6": {
    ...primitives["text-3x-sm"],
  },

  "text-body": {
    ...primitives["text-default"],
    letterSpacing: primitives["text-sm"].letterSpacing,
    "@media (max-width:600px)": {
      lineHeight: "150%",
    },
  },
  "text-body-link": {
    ...primitives["text-default"],
    color: blue[80],
    "&:hover a": { color: "#000000" },
  },

  "text-common": defaultText,
  "text-footnote": {
    fontWeight: 400,
    fontSize: 13,
    lineHeight: "130%",
    letterSpacing: "0.26px",
    fontFamily: "Open Sans",
    color: "#000000",
  },

  "table-data": tableData,
  "table-data-link": {
    ...tableData,
    color: blue[80],
    "&:hover a": { color: "#000000" },
  },
  "table-header": {
    ...tableData,
    color: grey[80],
    fontWeight: 600,
  },

  "card-title-group": {
    ...primitives["text-1x-lg"],
    color: grey[80],
    "@media (max-width:600px)": {
      color: "#000000",
      fontSize: 22,
    },
  },
  "card-title-inner": {
    ...primitives["text-default"],
    fontWeight: 600,
    fontSize: 15,
    letterSpacing: "0.15px",
    "@media (max-width:600px)": {
      fontSize: 16,
      letterSpacing: "0.16px",
    },
  },

  "form-label": {
    ...primitives["text-2x-sm"],
    "@media (max-width:600px)": {
      color: "#000000",
      fontSize: 16,
    },
  },
  "form-data": formData,
  "form-data-link": {
    ...formData,
    color: blue[80],
    "&:hover": { color: "#000000" },
  },
  "text-badge": {
    fontWeight: 700,
    fontSize: 11,
    lineHeight: "130%",
    letterSpacing: "0.44px",
    fontFamily: "Open Sans",
    textTransform: "uppercase" as const,
  },

  "message-info": {
    ...defaultText,
  },
  "message-error": {
    ...defaultText,
    color: red[100],
  },
  "message-success": {
    ...defaultText,
    color: green[100],
  },
};

// ============================================================================
// STYLING CONSTANTS
// ============================================================================

const disabled = grey[40];
const disabledText = grey["50a"];

const focusVisible = "0 0 0 2px #FFFFFF, 0 0 0 4px #000000 !important";
const focusVisibleCompact = "0 0 0 2px #000000 !important";

const borderPopper = `1px solid ${grey["50a"]}`;

const defaultBorder = `1px solid ${grey[50]}`;

const textButton = {
  minWidth: "auto",
  color: blue[80],
  textDecoration: "underline",
  padding: "10px 8px",
  "&:hover": {
    textDecoration: "underline",
    backgroundColor: "transparent",
    color: "#000000",
  },
  fontWeight: 400,
};

const bwHover = {
  "&:hover": {
    backgroundColor: "#000000",
    color: "#FFFFFF",
  },
};

// ============================================================================
// TYPE DECLARATIONS (RPM Theme Specific)
// ============================================================================
// These type augmentations are scoped to the RPM theme and define custom
// color palettes, typography variants, and component overrides specific to
// the RPM design system.
// ============================================================================

declare module "@mui/material" {
  interface Color {
    10: string;
    20: string;
    30: string;
    40: string;
    50: string;
    "50a": string;
    "60a": string;
    70: string;
    80: string;
    90: string;
  }
}

declare module "@mui/material/styles" {
  interface PaletteOptions {
    blue?: {
      100: string;
      80: string;
      40: string;
      10: string;
      5: string;
    };
    red?: {
      100: string;
      50: string;
      10: string;
    };
    green?: {
      100: string;
      80: string;
      50: string;
      10: string;
    };
    yellow?: {
      100: string;
      40: string;
      20: string;
      10: string;
    };
    orange?: {
      80: string;
      40: string;
      20: string;
    };
  }

  interface Palette {
    blue: {
      100: string;
      80: string;
      40: string;
      10: string;
      5: string;
    };
    red: {
      100: string;
      50: string;
      10: string;
    };
    green: {
      100: string;
      80: string;
      50: string;
      10: string;
    };
    yellow: {
      100: string;
      40: string;
      20: string;
      10: string;
    };
    orange: {
      80: string;
      40: string;
      20: string;
    };
  }

  interface TypographyVariantsOptions {
    "page-title"?: CSSProperties;
    "item-title"?: CSSProperties;
    "text-title-1"?: CSSProperties;
    "text-title-2"?: CSSProperties;
    "text-title-3"?: CSSProperties;
    "text-title-4"?: CSSProperties;
    "text-title-5"?: CSSProperties;
    "text-title-6"?: CSSProperties;

    "text-body"?: CSSProperties;
    "text-common"?: CSSProperties;
    "text-footnote"?: CSSProperties;

    "table-header"?: CSSProperties;
    "table-data"?: CSSProperties;
    "table-data-link"?: CSSProperties;

    "card-title-group"?: CSSProperties;
    "card-title-inner"?: CSSProperties;

    "form-label"?: CSSProperties;
    "form-data"?: CSSProperties;
    "form-data-link"?: CSSProperties;

    "text-badge"?: CSSProperties;

    "message-info"?: CSSProperties;
    "message-error"?: CSSProperties;
    "message-success"?: CSSProperties;
  }

  interface TypographyVariants {
    "page-title"?: CSSProperties;
    "item-title"?: CSSProperties;
    "text-title-1"?: CSSProperties;
    "text-title-2"?: CSSProperties;
    "text-title-3"?: CSSProperties;
    "text-title-4"?: CSSProperties;
    "text-title-5"?: CSSProperties;
    "text-title-6"?: CSSProperties;

    "text-body"?: CSSProperties;
    "text-common"?: CSSProperties;
    "text-footnote"?: CSSProperties;

    "table-header"?: CSSProperties;
    "table-data"?: CSSProperties;
    "table-data-link"?: CSSProperties;

    "card-title-group"?: CSSProperties;
    "card-title-inner"?: CSSProperties;

    "form-label"?: CSSProperties;
    "form-data"?: CSSProperties;
    "form-data-link"?: CSSProperties;

    "text-badge"?: CSSProperties;

    "message-info"?: CSSProperties;
    "message-error"?: CSSProperties;
    "message-success"?: CSSProperties;
  }

  interface Theme {
    customShadows?: {
      focusVisible: string;
      focusVisibleCompact: string;
    };
    borders?: {
      popper: string;
    };
  }

  interface ThemeOptions {
    customShadows?: {
      focusVisible?: string;
      focusVisibleCompact?: string;
    };
    borders?: {
      popper?: string;
    };
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    "page-title": true;
    "item-title": true;
    "text-title-1": true;
    "text-title-2": true;
    "text-title-3": true;
    "text-title-4": true;
    "text-title-5": true;
    "text-title-6": true;

    "text-body": true;
    "text-common": true;
    "text-footnote": true;

    "table-header": true;
    "table-data": true;
    "table-data-link": true;

    "card-title-group": true;
    "card-title-inner": true;

    "form-label": true;
    "form-data": true;
    "form-data-link": true;

    "text-badge": true;

    "message-info": true;
    "message-error": true;
    "message-success": true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsSizeOverrides {
    "x-small": true;
  }
}

declare module "@mui/material/SvgIcon" {
  interface SvgIconPropsSizeOverrides {
    compact: true;
  }
}

// ============================================================================
// THEME CREATION
// ============================================================================

let theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data", // Enable manual mode switching
  },
  spacing,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  customShadows: {
    focusVisible,
    focusVisibleCompact,
  },
  borders: {
    popper: borderPopper,
  },
  shape: {
    borderRadius: 0,
  },
  typography: typography as any,
  palette: {
    contrastThreshold: 4.5,
    // Required global colors
    neutral: {
      main: grey[50],
      light: grey[40],
      dark: grey["60a"],
      contrastText: "#000000",
    },
    black: {
      main: "#000000",
      light: grey[90],
      dark: grey[90],
      contrastText: "#FFFFFF",
    },
    white: {
      main: "#FFFFFF",
      light: grey[10],
      dark: grey[20],
      contrastText: "#000000",
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: blue[100],
          dark: "#000000",
        },
        error: {
          main: red[100],
        },
        secondary: {
          main: "#000000",
        },
        text: {
          primary: "#000000",
          disabled: disabledText,
        },
        action: {
          disabled,
          disabledBackground: disabled,
        },
        background: {
          default: "#FFFFFF",
          paper: grey[10],
        },
        // RPM-specific colors
        blue,
        red,
        yellow,
        green,
        grey,
        orange,
      },
    },
    dark: {
      palette: {
        primary: {
          main: blue[40], // Lighter blue for dark mode
          dark: grey[90],
        },
        error: {
          main: red[50], // Lighter red for dark mode
        },
        secondary: {
          main: "#FFFFFF",
        },
        text: {
          primary: "#FFFFFF",
          secondary: grey[40],
          disabled: grey["60a"],
        },
        action: {
          disabled: grey[70],
          disabledBackground: grey[80],
        },
        background: {
          default: grey[90],
          paper: grey[80],
        },
        // RPM-specific colors (reuse for now, can be adjusted)
        blue,
        red,
        yellow,
        green,
        grey,
        orange,
      },
    },
  },
});

// Step 2: Extend theme with component overrides that can access theme values
theme = createTheme(theme as any, {
  components: {
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
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 0,
          color: grey["50a"],
          "&.Mui-checked,&.MuiCheckbox-indeterminate": {
            color: green[100],
          },
          "&.Mui-focusVisible": {
            outline: "none",
            boxShadow: "none !important",
          },
          "&.Mui-focusVisible .MuiSvgIcon-root": {
            color: "#000",
          },
          "&:hover .MuiSvgIcon-root": {
            color: "#000",
          },
          "&.Mui-disabled .MuiSvgIcon-root": {
            color: disabled,
          },
          "& .MuiSvgIcon-root": {
            fontSize: "18px",
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: 0,
          color: grey["50a"],
          "&:hover": {
            backgroundColor: "transparent",
            color: "#000",
          },
          "&.Mui-focusVisible": {
            outline: "none",
            boxShadow: "none !important",
          },
          "&.Mui-checked": {
            color: grey["50a"],
          },
          "&:hover .MuiSvgIcon-root": {
            color: "#000",
          },
          "&.Mui-focusVisible .MuiSvgIcon-root": {
            color: "#000",
          },
          "&.Mui-disabled .MuiSvgIcon-root": {
            color: disabled,
          },
          "& .MuiSvgIcon-root": {
            fontSize: "18px",
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          outline: "none",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          ":hover .MuiCheckbox-root": {
            backgroundColor: "transparent",
            color: "#000000",
          },
        },
        label: {
          color: grey[90],
          fontWeight: 600,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: blue[80],
          outline: "none",
          "&:focus-visible": {
            boxShadow: focusVisibleCompact,
          },
          textDecorationColor: "unset",
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          "&.Mui-focusVisible": {
            boxShadow: focusVisible,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        placeholder: "Type here",
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 0,
          borderRadius: 0,
          color: blue[80],
          ":hover": {
            backgroundColor: "transparent",
            color: "#000000",
          },
          "&:focus-visible": {
            boxShadow: focusVisibleCompact,
          },
        },
      },
    },
    MuiSvgIcon: {
      variants: [
        {
          props: { fontSize: "compact" },
          style: { fontSize: 18 },
        },
      ],
      styleOverrides: {
        root: {
          fontSize: 24,
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { size: "x-small" },
          style: { fontSize: "0.75rem", padding: "6px 8px", height: 28 },
        },
      ],
      styleOverrides: {
        root: ({ ownerState }: { ownerState: any }) => ({
          textTransform: "none",
          ...defaultText,
          fontWeight: 600,
          color: "#FFFFFF",

          "& .MuiButton-startIcon": { marginRight: spacing(1) },
          "& .MuiButton-endIcon": { marginLeft: spacing(1) },

          ...(ownerState.variant === "contained" && {
            padding: "10px 24px",
            "&:disabled": {
              color: "#FFFFFF",
            },
          }),
          ...(ownerState.variant === "outlined" && {
            color: blue[80],
            "&:hover": {
              backgroundColor: "transparent",
              color: "#000000",
            },
          }),
          // TODO Sync with Figma fonts
          ...(ownerState.size === "large" && {
            padding: "14px 32px",
            height: 48,
          }),
          ...(ownerState.size === "medium" && {
            padding: "10px 24px",
            height: 38,
          }),
          ...(ownerState.size === "small" && {
            padding: "8px 16px",
            height: 34,
          }),
          ...(ownerState.variant === "text" && textButton),

          "&.compact": {
            padding: 0,
            height: "auto",
          },
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#000000",
          ...defaultText,
          color: "#ffffff",
          fontSize: "0.875rem",
        },
      },
    },
    // TextField variant="standard"
    MuiInput: {
      styleOverrides: {
        root: {
          transition: "background-color 0.2s ease",
          "&.Mui-focused": {
            backgroundColor: blue[10],
          },
          "&::before": {
            borderBottom: `2px solid ${blue[80]}`,
          },
          "&:hover:not(.Mui-disabled):not(.Mui-error)::before": {
            borderBottom: "2px solid #000000",
          },
          "&::after": {
            borderBottom: "2px solid #000000",
          },
          "&.Mui-error::before": {
            borderBottom: `2px solid ${red[100]}`,
          },
          "&.Mui-error::after": {
            borderBottom: `2px solid ${red[100]}`,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: any }) => ({
          ...typography["form-data"],

          ...(ownerState.size === "medium" && {
            padding: "10px 8px !important",
            height: 40,
          }),
          ...(ownerState.size === "small" && {
            padding: "4px 8px !important",
            height: 32,
          }),

          ".MuiInputAdornment-root .MuiButtonBase-root": {
            margin: 0,
          },

          "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: grey["50a"],
          },
          "&.MuiOutlinedInput-root:not(.Mui-disabled):hover .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#000000",
            },
          "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#000000",
            },
          "&.MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
            {
              borderColor: red[100],
            },
        }),
        multiline: ({ ownerState }: { ownerState: any }) => ({
          ...(ownerState.size === "medium" && {
            padding: "10px 8px !important",
            minHeight: 40,
            height: "unset",
          }),
          ...(ownerState.size === "small" && {
            padding: "4px 8px !important",
            minHeight: 32,
            height: "unset",
          }),
        }),
        input: {
          "&::placeholder": {
            fontStyle: "italic",
          },
          padding: "0 !important",
          "&:-webkit-autofill": {
            transitionDelay: "9999s",
            transitionProperty: "background-color, color",
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: defaultBorder,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          whiteSpace: "pre-wrap",
          minWidth: 100,
          paddingRight: "26px !important",
        },
        root: ({ ownerState }: { ownerState: any }) => ({
          height: "unset",
          ".MuiSelect-icon": {
            right: 8,
            color: grey["50a"],
            "&.Mui-disabled": {
              color: disabled,
            },
          },
          "&:hover": {
            ".MuiSelect-icon:not(.Mui-disabled)": {
              color: "#000000",
            },
            "&.text-select:not(.Mui-disabled)": {
              ".select-value, .MuiSelect-icon": {
                color: "#000",
              },
            },
          },
          ".select-value": {
            color: "#000",
          },

          ".select-placeholder": {
            color: grey["60a"],
            fontStyle: "italic",
          },

          "&.text-select": {
            padding: 0,
            marginBottom: `-${spacing(0.5)}`,
            paddingRight: "2px !important",
            ".select-value, .MuiSelect-icon": {
              color: blue[80],
            },
            ".MuiSelect-icon": {
              fontSize: 16,
              right: 8,
              "&.Mui-disabled": {
                color: disabled,
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          },

          ...(ownerState.size === "medium" && { minHeight: 40 }),
          ...(ownerState.size === "small" && { minHeight: 32 }),
        }),
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "&.multi-select": {
            ".MuiInputBase-root": {
              height: "unset",
              paddingRight: "30px !important",
            },
          },
          "&.select-search.clearable:not(.with-popup)": {
            ".MuiInputBase-root": {
              paddingRight: "30px !important",
            },
          },
          "&.select-search.clearable.with-popup": {
            ".MuiInputBase-root": {
              paddingRight: "60px !important",
            },
          },
          ".MuiChip-root": {
            backgroundColor: "transparent",
            margin: 0,
            height: 20,
            marginRight: spacing(1),
            "&:has(.MuiChip-deleteIcon:hover) .MuiChip-label": {
              color: "#000",
            },
          },
          ".MuiChip-label": {
            ...typography["text-common"],
            fontSize: 13,
            padding: 0,
            paddingRight: spacing(2),
          },
          ".MuiChip-deleteIcon": {
            marginLeft: 0,
            color: `${blue[80]} !important`,
            "&:hover": {
              color: "#000 !important",
            },
            "&:hover ~ .MuiChip-label": {
              color: "#ff0ff0 !important",
            },
          },
          ".MuiSvgIcon-root": {
            color: grey["50a"],
            "&.Mui-disabled": {
              color: disabled,
            },
            "&:hover": {
              color: "#000",
            },
          },
        },
        listbox: {
          padding: 0,
        },
        noOptions: {
          padding: 0,
        },
        tag: {
          margin: 0,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          padding: 0,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: () => {
          const px = `${parseInt(spacing(2)) - 1}px`;
          const mediumPy = spacing(2.5);
          const smallPy = spacing(1.5);
          return {
            "&.select-option": {
              ...typography["text-common"],
              whiteSpace: "normal",

              borderTop: borderPopper,
              "&:first-of-type": {
                borderTopWidth: 0,
              },

              "&.Mui-focused,&:focus-visible": {
                boxShadow: "none !important",
                backgroundColor: grey[20],
              },

              "&:hover": {
                backgroundColor: grey[20],
              },

              '&.MuiAutocomplete-option[aria-selected="true"],&.Mui-selected': {
                backgroundColor: grey[20],
              },

              "&.medium": {
                minHeight: 40,
                padding: `${mediumPy} ${px}`,
              },
              "&.small": {
                minHeight: 32,
                padding: `${smallPy} ${px}`,
              },
              "&.read-only": {
                pointerEvents: "none",
                cursor: "default",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              },
              "&.borderless": {
                border: "none",
              },
              "&.nested": {
                paddingLeft: spacing(4),
              },
            },
          };
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          ".MuiButtonBase-root": {
            borderRadius: 0,
            "&:focus-visible": {
              boxShadow: focusVisibleCompact,
            },
          },
          ".MuiPickersCalendarHeader-label": {
            ...defaultText,
            ...textButton,
            fontWeight: 600,
          },
          ".MuiPickersCalendarHeader-switchViewButton": {
            margin: 4,
          },
          ".MuiPickersArrowSwitcher-button": {
            margin: 2,
          },
          ".MuiPickersCalendarHeader-switchViewButton, .MuiPickersArrowSwitcher-button":
            {
              color: blue[100],
              ":hover": {
                boxShadow: `0 0 0 1px  ${grey[50]}`,
              },
            },
          ".MuiPickersDay-root, .MuiPickersYear-yearButton": {
            ...defaultText,
            borderRadius: 0,
          },
          ".MuiPickersDay-root:not([disabled]), .MuiPickersYear-yearButton:not([disabled])":
            {
              ...textButton,
              backgroundColor: "transparent",
              ...bwHover,
              height: 36,
              textDecoration: "none",
              color: "#000000",
              "&.Mui-selected": {
                backgroundColor: blue[100],
                color: "#ffffff",
                pointerEvents: "none",
              },
              "&:focus-visible": {
                backgroundColor: "transparent",
                color: "#000000",
              },
            },
          ".MuiDayCalendar-header": {
            borderBottom: defaultBorder,
            marginLeft: 12,
            marginRight: 12,
          },
          ".MuiDayCalendar-weekDayLabel": {
            ...defaultText,
            fontWeight: 600,
            height: 30,
          },
        },
      },
    },
  },
});

export default theme;
