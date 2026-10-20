import React from "react";
import { FormControl, FormGroup } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  FormGroup,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=642%3A108242",
  {
    props: {
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

      formLabel: figma.boolean("<FormLabel>", {
        true: figma.children("<FormLabel>"),
        false: undefined,
      }),

      formHelperText: figma.boolean("<FormHelperText>", {
        true: figma.children("<FormHelperText>"),
        false: undefined,
      }),

      // Layer naming is inconsistent across the control families, so accept both spellings.
      switches: figma.children([
        "<FormControlLabel> | Switch",
        "<FormControlLabel> | <Switch>",
      ]),
    },

    example: ({ disabled, error, formLabel, formHelperText, switches }) => (
      <FormControl component="fieldset" disabled={disabled} error={error}>
        {formLabel}
        <FormGroup>{switches}</FormGroup>
        {formHelperText}
      </FormControl>
    ),

    links: [
      {
        name: "MUI Switch",
        url: "https://mui.com/material-ui/react-switch/",
      },
    ],
  },
);
