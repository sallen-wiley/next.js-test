// src/components/mui/inputs/FormGroup.figma.tsx
import React from "react";
import { FormControl, FormGroup } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  FormGroup,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=2483%3A185674",
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

      // Designers express a bare group by switching these off, so presence is driven
      // by the booleans rather than rendered unconditionally.
      formLabel: figma.boolean("<FormLabel>", {
        true: figma.children("<FormLabel>"),
        false: undefined,
      }),

      formHelperText: figma.boolean("<FormHelperText>", {
        true: figma.children("<FormHelperText>"),
        false: undefined,
      }),

      // The library names the checkbox rows "<FormControlLabel> | <Checkbox>" while the
      // radio and switch families omit the brackets. Match both so a rename cannot
      // silently empty the group.
      checkboxes: figma.children([
        "<FormControlLabel> | <Checkbox>",
        "<FormControlLabel> | Checkbox",
      ]),
    },

    example: ({ disabled, error, formLabel, formHelperText, checkboxes }) => (
      <FormControl component="fieldset" disabled={disabled} error={error}>
        {/* Check the design: nested checkbox families are shown by indentation, which this snippet cannot express. */}
        {formLabel}
        <FormGroup>{checkboxes}</FormGroup>
        {formHelperText}
      </FormControl>
    ),

    links: [
      {
        name: "MUI Checkbox API",
        url: "https://mui.com/material-ui/react-checkbox/#indeterminate",
      },
    ],
  },
);
