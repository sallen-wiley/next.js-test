// src/components/mui/inputs/FormControlLabel.figma.tsx
import React from "react";
import { FormControlLabel } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  FormControlLabel,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=642%3A114394",
  {
    props: {
      labelPlacement: figma.enum("Label Placement", {
        End: "end",
        Start: "start",
        Top: "top",
        Bottom: "bottom",
      }),

      disabled: figma.boolean("Disabled", {
        true: true,
        false: false,
      }),

      control: figma.children("<Checkbox>"),

      label: figma.nestedProps("<FormLabel>", {
        value: figma.string("Value"),
      }),
    },

    example: ({ labelPlacement, disabled, control, label }) => (
      <FormControlLabel
        control={control}
        labelPlacement={labelPlacement}
        disabled={disabled}
        label={label.value}
      />
    ),
  },
);
