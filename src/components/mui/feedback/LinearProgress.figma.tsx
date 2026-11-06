import React from "react";
import { LinearProgress } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  LinearProgress,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6586%3A46855",
  {
    props: {
      variant: figma.enum("Type", {
        Determinate: "determinate",
        Buffer: "buffer",
        Indeterminate: undefined,
      }),

      color: figma.enum("Color", {
        Inherit: "inherit",
        Primary: undefined,
        Secondary: "secondary",
      }),

      value: figma.enum("Type", {
        Determinate: 50,
        Buffer: 50,
        Indeterminate: undefined,
      }),

      valueBuffer: figma.enum("Type", {
        Determinate: undefined,
        Buffer: 75,
        Indeterminate: undefined,
      }),
    },

    example: ({ variant, color, value, valueBuffer }) => (
      <LinearProgress
        variant={variant}
        color={color}
        value={value}
        valueBuffer={valueBuffer}
      />
    ),

    links: [
      {
        name: "MUI LinearProgress API",
        url: "https://mui.com/material-ui/api/linear-progress/",
      },
    ],
  },
);
