import MuiAlert from "./MuiAlert";
import MuiChip from "./MuiChip";
import { MuiButtonBase, MuiButton } from "./MuiButton";
import { Theme } from "@mui/material/styles";

export const createComponents = (theme: Theme) => ({
  MuiAlert: typeof MuiAlert === "function" ? MuiAlert(theme) : MuiAlert,
  MuiChip: typeof MuiChip === "function" ? MuiChip(theme) : MuiChip,
  MuiButton,
  MuiButtonBase,
});
