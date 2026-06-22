// src/components/mui/inputs/FormHelperText.figma.tsx
import React from "react";
import { FormHelperText } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  FormHelperText,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=11140%3A154883",
  {
    props: {
      disabled: figma.enum("Disabled", {
        Enabled: false,
        Error: false,
        Disabled: true,
      }),

      error: figma.enum("Disabled", {
        Enabled: false,
        Error: true,
        Disabled: false,
      }),

      children: figma.string("Value"),
    },

    example: ({ disabled, error, children }) => (
      <FormHelperText disabled={disabled} error={error}>
        {children}
      </FormHelperText>
    ),
  },
);
