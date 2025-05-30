import { PaletteMode } from "@mui/material";
import * as colors from "./colors";

export const createPalette = (mode: PaletteMode) => ({
  mode,
  // Default MUI palette for now
  // You can expand this with your custom palette settings
  contrastThreshold: 4.5,
  primary: {
    main: colors.blue[500],
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
  text: {
    primary: colors.common.black,
    secondary: colors.grey[800],
    disabled: colors.grey[600],
  },
});
