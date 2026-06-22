// src/components/mui/inputs/FormGroup.figma.tsx
import React from "react";
import {
  FormControl,
  FormHelperText,
  FormGroup,
  FormLabel,
} from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  FormGroup,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6543%3A43147",
  {
    props: {
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

      formLabel: figma.nestedProps("<FormLabel>", {
        value: figma.string("Value"),
      }),

      formHelperText: figma.nestedProps("<FormHelperText>", {
        value: figma.string("Value"),
      }),

      checkboxes: figma.children("<FormControlLabel> | Checkbox"),
    },

    example: ({ disabled, error, formLabel, formHelperText, checkboxes }) => (
      <FormControl component="fieldset" disabled={disabled} error={error}>
        <FormLabel component="legend" disabled={disabled} error={error}>
          {formLabel.value}
        </FormLabel>
        <FormGroup>{checkboxes}</FormGroup>
        <FormHelperText disabled={disabled} error={error}>
          {formHelperText.value}
        </FormHelperText>
      </FormControl>
    ),
  },
);
