import { Theme } from "@mui/material/styles";

const createMuiPaginationItem = (theme: Theme) => ({
  styleOverrides: {
    root: {
      fontWeight: "600",
      "&.MuiPaginationItem-outlinedPrimary": {
        color: theme.palette.primary.main,
      },
      "&.MuiPaginationItem-textPrimary": {
        color: theme.palette.primary.main,
        "&.Mui-selected": {
          color: theme.palette.primary.contrastText,
        },
      },
    },
  },
});

export default createMuiPaginationItem;
