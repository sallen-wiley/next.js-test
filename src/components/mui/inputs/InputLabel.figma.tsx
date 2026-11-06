import React from "react";
import { InputLabel } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  InputLabel,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=11140%3A154655",
  {
    props: {
      color: figma.enum("Color", {
        "-": undefined,
        Primary: "primary",
        Secondary: "secondary",
        Error: "error",
        Warning: "warning",
        Info: "info",
        Success: "success",
      }),

      disabled: figma.enum("State", {
        Enabled: undefined,
        Disabled: true,
        Error: undefined,
      }),

      error: figma.enum("State", {
        Enabled: undefined,
        Disabled: undefined,
        Error: true,
      }),

      children: figma.string("Value"),
    },

    example: ({ color, disabled, error, children }) => (
      <InputLabel color={color} disabled={disabled} error={error}>
        {children}
      </InputLabel>
    ),

    links: [
      {
        name: "MUI InputLabel API",
        url: "https://mui.com/material-ui/api/input-label/",
      },
    ],
  },
);
