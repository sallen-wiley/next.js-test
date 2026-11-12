// src/components/mui/inputs/Autocomplete.figma.tsx
// Figma nests <Select> inside <Autocomplete>; MUI does not. Harvest input props
// (label, variant, size, state) from that nested Select and put them on TextField
// via renderInput — Autocomplete itself has no variant prop.
// Nested Select uses Value? to show <InputValues> (Has Value axis is vestigial).
// options are placeholders; check the design for the real option list.
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
      // Always emit variant (including outlined) so the nested Select Variant is visible
      // in the snippet — Autocomplete masters default to Outlined, which would otherwise
      // look like variant was never mapped.
      select: figma.nestedProps("<Select>", {
        label: figma.string("Label"),

        variant: figma.enum("Variant", {
          Standard: "standard",
          Filled: "filled",
          Outlined: "outlined",
        }),

        size: figma.enum("Size", {
          Small: "small",
          Medium: undefined,
        }),

        disabled: figma.enum("State", {
          Enabled: undefined,
          Hovered: undefined,
          Focused: undefined,
          Disabled: true,
          Error: undefined,
        }),

        error: figma.enum("State", {
          Enabled: undefined,
          Hovered: undefined,
          Focused: undefined,
          Disabled: undefined,
          Error: true,
        }),
      }),

    },

    example: ({ multiple, select }) => (
      // Check the design: nested Select Value? shows <InputValues> — wire value /
      // defaultValue (string or array when multiple) from InputValues.Value / chips.
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
