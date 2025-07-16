import * as colors from "../palette/colors";
import { Theme } from "@mui/material/styles";

const createMuiAlert = (theme: Theme) => ({
  styleOverrides: {
    standardSuccess: {
      backgroundColor: colors.green[50],
      color: theme.palette.text.primary,
    },
    outlinedSuccess: {
      borderColor: theme.palette.success.main, // default is the theme's 'light' color
      color: theme.palette.success.main,
    },
    standardError: {
      backgroundColor: colors.red[50],
      color: theme.palette.text.primary,
    },
    outlinedError: {
      borderColor: theme.palette.error.main, // default is the theme's 'light' color
      color: theme.palette.error.main,
    },
    standardInfo: {
      backgroundColor: colors.blue[50],
      color: theme.palette.text.primary,
    },
    outlinedInfo: {
      borderColor: theme.palette.info.main, // default is the theme's 'light' color
      color: theme.palette.info.main,
    },
    standardWarning: {
      backgroundColor: colors.orange[50],
      color: theme.palette.text.primary,
    },
    outlinedWarning: {
      borderColor: theme.palette.warning.main, // default is the theme's 'light' color
      color: theme.palette.warning.main,
    },
  },
});

export default createMuiAlert;
