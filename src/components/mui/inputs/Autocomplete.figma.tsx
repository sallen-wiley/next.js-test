// src/components/mui/inputs/Autocomplete.figma.tsx
// Figma nests <Select> inside <Autocomplete>; MUI does not. Only "Multiple Value" is a real
// Figma property, so everything else (label, value, variant) is left for the reader.
// options/label are placeholders taken from the component's own Figma usage description.
import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Autocomplete,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6570%3A49856",
  {
    props: {
      multiple: figma.boolean("Multiple Value", {
        true: true,
        false: undefined,
      }),

      // Figma nests <Select> as the input field; harvest its real properties from there.
      select: figma.nestedProps("<Select>", {
        label: figma.string("Label"),

        variant: figma.enum("Variant", {
          Standard: "standard",
          Filled: "filled",
          Outlined: undefined,
        }),

        size: figma.enum("Size", {
          Small: "small",
          Medium: undefined,
        }),

        disabled: figma.enum("State", {
          Enabled: false,
          Hovered: false,
          Focused: false,
          Disabled: true,
          Error: false,
        }),

        error: figma.enum("State", {
          Enabled: false,
          Hovered: false,
          Focused: false,
          Disabled: false,
          Error: true,
        }),
      }),
    },

    example: ({ multiple, select }) => (
      <Autocomplete
        multiple={multiple}
        disabled={select.disabled}
        size={select.size}
        options={["Option 1", "Option 2", "Option 3"]}
        renderInput={(params) => (
          <TextField
            {...params}
            label={select.label}
            variant={select.variant}
            error={select.error}
          />
        )}
      />
    ),

    links: [
      {
        name: "MUI Autocomplete API",
        url: "https://mui.com/material-ui/api/autocomplete/",
      },
    ],
  },
);
