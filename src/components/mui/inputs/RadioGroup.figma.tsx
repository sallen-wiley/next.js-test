import React from "react";
import { FormControl, RadioGroup } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  RadioGroup,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=1479%3A32615",
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
      radios: figma.children([
        "<FormControlLabel> | Radio",
        "<FormControlLabel> | <Radio>",
      ]),
    },

    example: ({ disabled, error, formLabel, formHelperText, radios }) => (
      <FormControl component="fieldset" disabled={disabled} error={error}>
        {/* Check the design: each option's value comes from its label, so repeated labels produce repeated values and break exclusive selection. */}
        {formLabel}
        <RadioGroup>{radios}</RadioGroup>
        {formHelperText}
      </FormControl>
    ),

    links: [
      {
        name: "MUI Radio Group",
        url: "https://mui.com/material-ui/react-radio-button/",
      },
    ],
  },
);
