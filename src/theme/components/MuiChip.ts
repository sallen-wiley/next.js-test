import { Theme } from "@mui/material/styles";

const createMuiChip = (theme: Theme) => ({
  styleOverrides: {
    label: {
      // ensure the chip uses the same font as the button
      fontWeight: theme.typography.button.fontWeight,
    },
  },
});

export default createMuiChip;
