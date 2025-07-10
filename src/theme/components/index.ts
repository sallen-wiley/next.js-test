import MuiAlert from "./MuiAlert";
import MuiChip from "./MuiChip";
import { MuiButtonBase, MuiButton } from "./MuiButton";
import { MuiTextField, MuiInputLabel, MuiOutlinedInput } from "./MuiForm";
import { Theme } from "@mui/material/styles";

export const createComponents = (theme: Theme) => ({
  MuiAlert: typeof MuiAlert === "function" ? MuiAlert(theme) : MuiAlert,
  MuiChip: typeof MuiChip === "function" ? MuiChip(theme) : MuiChip,
  MuiButton,
  MuiButtonBase,
  MuiTextField,
  MuiInputLabel,
  MuiOutlinedInput,
});
