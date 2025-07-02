import { PaletteMode } from "@mui/material";
import { lighten, darken } from "@mui/material/styles";
import * as colors from "./colors";
// import * as colors from "@mui/material/colors";

export const createPalette = (mode: PaletteMode) => ({
  mode,
  // Default MUI palette for now
  // You can expand this with your custom palette settings
  contrastThreshold: 4.5,
  primary: {
    main: colors.cyan[500],
    dark: colors.blue[800],
  },
  secondary: {
    main: colors.pink[500],
  },
  error: {
    main: colors.red[500],
  },
  warning: {
    main: colors.orange[500],
  },
  info: {
    main: colors.blue[500],
  },
  success: {
    main: colors.green[500],
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
  text: {
    primary: colors.common.black,
    secondary: colors.grey[800],
    disabled: colors.grey[600],
  },
});
