import React from "react";
import { Slider } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Slider,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6562%3A39045",
  {
    props: {
      size: figma.enum("Size", {
        Small: "small",
        Medium: undefined,
      }),

      color: figma.enum("Color", {
        Primary: undefined,
        Secondary: "secondary",
      }),

      orientation: figma.enum("Orientation", {
        Horizontal: undefined,
        Vertical: "vertical",
      }),

      disabled: figma.enum("State", {
        Enabled: undefined,
        Hover: undefined,
        Disabled: true,
      }),

      marks: figma.enum("Variant", {
        Continuous: undefined,
        Marks: true,
        Range: undefined,
      }),

      // Range uses a two-thumb default; Continuous/Marks use a single value.
      defaultValue: figma.enum("Variant", {
        Continuous: 30,
        Marks: 30,
        Range: [20, 50],
      }),

      valueLabelDisplay: figma.boolean("Values", {
        true: "on",
        false: undefined,
      }),
    },

    example: ({
      size,
      color,
      orientation,
      disabled,
      marks,
      defaultValue,
      valueLabelDisplay,
    }) => (
      <Slider
        size={size}
        color={color}
        orientation={orientation}
        disabled={disabled}
        marks={marks}
        defaultValue={defaultValue}
        valueLabelDisplay={valueLabelDisplay}
      />
    ),

    links: [
      {
        name: "MUI Slider API",
        url: "https://mui.com/material-ui/api/slider/",
      },
    ],
  },
);
