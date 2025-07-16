import { Theme } from "@mui/material/styles";

const MuiTextField = {
  defaultProps: {
    slotProps: {
      inputLabel: {
        shrink: true, // Ensure the label is always shrunk
      },
    },
  },
};

const SHRUNK_LABEL_SCALE = 0.875; // MUI default is 0.75 - which is too small for Wiley's design system
const SHRUNK_LABEL_LINEHEIGHT = 1.5; // The line height of the shrunk label - we use this to translate the label and ensure it is vertically aligned with teh outlined input border. We need a lineheight larger than the font-size to prevent decenders from being hidden in the overflow

const MuiInputLabel = {
  defaultProps: {
    shrink: true,
  },
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      color: theme.palette.text.secondary,
      // theme.palette.text.primary = black or #000000
    }),
    outlined: {
      "&.MuiInputLabel-shrink": {
        lineHeight: SHRUNK_LABEL_LINEHEIGHT,
        transform: `translate(14px, ${
          SHRUNK_LABEL_LINEHEIGHT * SHRUNK_LABEL_SCALE * -0.5 * 16 // 16px is the default font size in MUI, so we multiply by SHRUNK_LABEL_SCALE and SHRUNK_LABEL_LINEHEIGHT to get the correct translation
        }px) scale(${SHRUNK_LABEL_SCALE})`,
        // required to accommodate for the larger shrunk label size
      },
    },
  },
};

const MuiOutlinedInput = {
  styleOverrides: {
    root: {
      // Styles for the root element
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderWidth: 2,
        // increase width to compensate for low contrast between Wiley dark blue and default border color
      },
    },
    notchedOutline: ({ theme }: { theme: Theme }) => ({
      borderColor: theme.palette.text.secondary,
      // reuse the secondary text color for the border
      "& legend": {
        fontSize: `${SHRUNK_LABEL_SCALE}em`,
        // increase the font size of the invisible label used to 'notch' the outline. This should match the MuiInput Label transformation value
        maxWidth: "100%",
      },
    }),
  },
};

export { MuiTextField, MuiInputLabel, MuiOutlinedInput };
