import type { CSSObject } from "@mui/system";
const MuiButtonBase = {
  // disable ripple
  defaultProps: {
    disableRipple: true,
  },
  // add black outline focus state and include optional White outline focus state
  styleOverrides: {
    root: {
      "&.Mui-focusVisible": {
        outline: "2px solid black",
        outlineOffset: "2px",
      },
      "&.Mui-focusVisibleOnDark:focus-visible": {
        outline: "2px solid white",
        outlineOffset: "2px",
      },
    },
  },
};

const MuiButton = {
  styleOverrides: {
    // prevent text transforming on buttons
    root: {
      textTransform: "none" as CSSObject["textTransform"],
    },
    // add optional extra large button
    sizeExtraLarge: {
      padding: "10px 28px",
      fontSize: "1rem",
      "& .MuiButton-startIcon > *:nth-of-type(1), & .MuiButton-endIcon > *:nth-of-type(1)":
        {
          fontSize: "24px",
        },
    },
    // change text variant styling to include underline
    text: {
      textDecoration: "underline",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
};

export { MuiButtonBase, MuiButton };
