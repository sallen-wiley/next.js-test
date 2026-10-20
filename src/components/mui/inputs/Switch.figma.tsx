import React from "react";
import { Switch } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Switch,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6564%3A39128",
  {
    props: {
      checked: figma.enum("Checked", {
        True: true,
        False: undefined,
      }),

      size: figma.enum("Size", {
        Small: "small",
        Medium: undefined,
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
      <Switch
        defaultChecked={checked}
        size={size}
        color={color}
        disabled={disabled}
      />
    ),

    links: [
      {
        name: "MUI Switch API",
        url: "https://mui.com/material-ui/api/switch/",
      },
    ],
  },
);
