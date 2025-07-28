import MuiAlert from "./MuiAlert";
import MuiChip from "./MuiChip";
import MuiPaginationItem from "./MuiPagination";
import { MuiButtonBase, MuiButton } from "./MuiButton";
import { MuiTextField, MuiInputLabel, MuiOutlinedInput } from "./MuiForm";
import { Theme } from "@mui/material/styles";
import MuiContainer from "./MuiContainer";

export const createComponents = (theme: Theme) => ({
  MuiAlert: typeof MuiAlert === "function" ? MuiAlert(theme) : MuiAlert,
  MuiChip: typeof MuiChip === "function" ? MuiChip(theme) : MuiChip,
  MuiButton,
  MuiButtonBase,
  MuiTextField,
  MuiInputLabel,
  MuiOutlinedInput,
  MuiContainer:
    typeof MuiContainer === "function" ? MuiContainer(theme) : MuiContainer,
  MuiPaginationItem:
    typeof MuiPaginationItem === "function"
      ? MuiPaginationItem(theme)
      : MuiPaginationItem,
});
