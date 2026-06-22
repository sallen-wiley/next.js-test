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
        False: false,
      }),

      indeterminate: figma.enum("Indeterminate", {
        True: true,
        False: false,
      }),

      size: figma.enum("Size", {
        Small: "small",
        Medium: "medium",
        Large: "large",
      }),

      color: figma.enum("Color", {
        Default: "default",
        Primary: "primary",
        Secondary: "secondary",
        Error: "error",
        Warning: "warning",
        Info: "info",
        Success: "success",
      }),

      disabled: figma.enum("State", {
        Disabled: true,
        Enabled: false,
        Hovered: false,
        Focused: false,
        Pressed: false,
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
  },
);
