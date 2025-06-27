import * as colors from "../palette/colors";
import { Theme } from "@mui/material/styles";

const createMuiAlert = (theme: Theme) => ({
  styleOverrides: {
    standardSuccess: {
      backgroundColor: colors.green[50],
      color: theme.palette.text.primary,
    },
    outlinedSuccess: {
      color: theme.palette.success.main,
    },
    standardError: {
      backgroundColor: colors.red[50],
      color: theme.palette.text.primary,
    },
    outlinedError: {
      color: theme.palette.error.main,
    },
    standardInfo: {
      backgroundColor: colors.blue[50],
      color: theme.palette.text.primary,
    },
    outlinedInfo: {
      color: theme.palette.info.main,
    },
    standardWarning: {
      backgroundColor: colors.orange[50],
      color: theme.palette.text.primary,
    },
    outlinedWarning: {
      color: theme.palette.warning.main,
    },
  },
});

export default createMuiAlert;
