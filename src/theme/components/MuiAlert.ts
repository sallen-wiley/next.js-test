import * as colors from "../palette/colors";
import { Theme } from "@mui/material/styles";

const MuiAlert = {
  // Change colors of alerts
  styleOverrides: {
    standardSuccess: ({ theme }: { theme: Theme }) => ({
      backgroundColor: colors.green[50],
      color: theme.palette.text.primary,
    }),
    outlinedSuccess: ({ theme }: { theme: Theme }) => ({
      color: theme.palette.success.main,
    }),
    standardError: ({ theme }: { theme: Theme }) => ({
      backgroundColor: colors.red[50],
      color: theme.palette.text.primary,
    }),
    outlinedError: ({ theme }: { theme: Theme }) => ({
      color: theme.palette.error.main,
    }),
    standardInfo: ({ theme }: { theme: Theme }) => ({
      backgroundColor: colors.blue[50],
      color: theme.palette.text.primary,
    }),
    outlinedInfo: ({ theme }: { theme: Theme }) => ({
      color: theme.palette.info.main,
    }),
    standardWarning: ({ theme }: { theme: Theme }) => ({
      backgroundColor: colors.orange[50],
      color: theme.palette.text.primary,
    }),
    outlinedWarning: ({ theme }: { theme: Theme }) => ({
      color: theme.palette.warning.main,
    }),
  },
};

export default MuiAlert;
