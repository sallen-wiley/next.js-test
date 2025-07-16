import { Theme } from "@mui/material/styles";

// Best practice: export a function that takes the theme as an argument
const MuiContainer = (theme: Theme) => ({
  styleOverrides: {
    // update padding for all breakpoints and preserve "disableGutters" prop
    root: {
      paddingLeft: "15px",
      paddingRight: "15px",
      "&.MuiContainer-disableGutters": {
        paddingLeft: 0,
        paddingRight: 0,
      },
      [theme.breakpoints.up("sm")]: {
        paddingLeft: "15px",
        paddingRight: "15px",
      },
      [theme.breakpoints.up("md")]: {
        paddingLeft: "15px",
        paddingRight: "15px",
      },
      [theme.breakpoints.up("lg")]: {
        paddingLeft: "15px",
        paddingRight: "15px",
      },
      [theme.breakpoints.up("xl")]: {
        paddingLeft: "15px",
        paddingRight: "15px",
      },
    },
    // Set container max-widths when 'Fixed' prop is used (Fixed should be used by default unless specified otherwise)
    fixed: {
      maxWidth: "100%",
      [theme.breakpoints.up("sm")]: {
        maxWidth: "100%",
      },
      [theme.breakpoints.up("md")]: {
        maxWidth: "100%",
      },
      [theme.breakpoints.up("lg")]: {
        maxWidth: "1290px",
      },
      [theme.breakpoints.up("xl")]: {
        maxWidth: "1630px",
      },
    },
    // If using fluid or 'fixed=false' containers, ensure container max-widths are same as fixed max-widths
    maxWidthLg: {
      [theme.breakpoints.up("lg")]: {
        maxWidth: "1290px",
      },
    },
    maxWidthXl: {
      [theme.breakpoints.up("xl")]: {
        maxWidth: "1630px",
      },
    },
  },
});

export default MuiContainer;
