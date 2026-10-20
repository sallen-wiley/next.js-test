import React from "react";
import { Radio } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Radio,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6558%3A39273",
  {
    props: {
      checked: figma.enum("Checked", {
        True: true,
        False: undefined,
      }),

      size: figma.enum("Size", {
        Small: "small",
        Medium: undefined,
        // MUI Radio has no "large" size. Omit rather than emit invalid JSX.
        Large: undefined,
      }),

      color: figma.enum("Color", {
        Default: "default",
        Primary: undefined,
        Secondary: "secondary",
        Error: "error",
        Warning: "warning",
        Info: "info",
        Success: "success",
      }),

      disabled: figma.enum("State", {
        Disabled: true,
        Enabled: undefined,
        Hovered: undefined,
        Focused: undefined,
        Pressed: undefined,
      }),
    },

    example: ({ checked, size, color, disabled }) => (
      <Radio
        defaultChecked={checked}
        size={size}
        color={color}
        disabled={disabled}
      />
    ),

    links: [
      {
        name: "MUI Radio API",
        url: "https://mui.com/material-ui/api/radio/",
      },
    ],
  },
);
