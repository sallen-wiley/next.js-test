// src/components/mui/inputs/Checkbox.figma.tsx
import React from "react";
import { Checkbox } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Checkbox,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6543%3A43052",
  {
    props: {
      checked: figma.enum("Checked", {
        True: true,
        False: undefined,
      }),

      indeterminate: figma.enum("Indeterminate", {
        True: true,
        False: undefined,
      }),

      size: figma.enum("Size", {
        Small: "small",
        Medium: undefined,
        // MUI Checkbox has no "large" size. Omit rather than emit invalid JSX.
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

    example: ({ checked, indeterminate, size, color, disabled }) => (
      <Checkbox
        defaultChecked={checked}
        indeterminate={indeterminate}
        size={size}
        color={color}
        disabled={disabled}
      />
    ),

    links: [
      {
        name: "MUI Checkbox API",
        url: "https://mui.com/material-ui/api/checkbox/",
      },
    ],
  },
);
