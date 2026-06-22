// src/components/mui/inputs/FormLabel.figma.tsx
import React from "react";
import { FormLabel } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  FormLabel,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=11436%3A165380",
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
        Enabled: false,
        Disabled: true,
        Error: false,
      }),

      error: figma.enum("State", {
        Enabled: false,
        Disabled: false,
        Error: true,
      }),

      children: figma.string("Value"),
    },

    example: ({ color, disabled, error, children }) => (
      <FormLabel color={color} disabled={disabled} error={error}>
        {children}
      </FormLabel>
    ),
  },
);
