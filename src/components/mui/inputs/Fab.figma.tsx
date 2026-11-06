import React from "react";
import { Fab } from "@mui/material";
import figma from "@figma/code-connect";

const fabNode =
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6556%3A38264";

figma.connect(Fab, fabNode, {
  variant: {
    Variant: "Extended",
  },

  props: {
    size: figma.enum("Size", {
      Small: "small",
      Medium: undefined,
      Large: "large",
    }),

    color: figma.enum("Color", {
      Default: "default",
      Primary: "primary",
      Secondary: "secondary",
      Inherit: "inherit",
      "Inherit (white)": "inherit",
    }),

    disabled: figma.enum("State", {
      Enabled: undefined,
      Hovered: undefined,
      Focused: undefined,
      Pressed: undefined,
      Disabled: true,
    }),

    label: figma.string("Label"),

    startIcon: figma.boolean("Start icon?", {
      true: figma.instance("↳ Icon"),
      false: undefined,
    }),

    endIcon: figma.boolean("End icon?", {
      true: figma.instance("↳ Icon"),
      false: undefined,
    }),
  },

  example: ({ size, color, disabled, label, startIcon, endIcon }) => (
    <Fab
      variant="extended"
      size={size}
      color={color}
      disabled={disabled}
    >
      {startIcon}
      {label}
      {endIcon}
    </Fab>
  ),

  links: [
    {
      name: "MUI Fab API",
      url: "https://mui.com/material-ui/api/fab/",
    },
  ],
});

figma.connect(Fab, fabNode, {
  variant: {
    Variant: "Round",
  },

  props: {
    size: figma.enum("Size", {
      Small: "small",
      Medium: undefined,
      Large: "large",
    }),

    color: figma.enum("Color", {
      Default: "default",
      Primary: "primary",
      Secondary: "secondary",
      Inherit: "inherit",
      "Inherit (white)": "inherit",
    }),

    disabled: figma.enum("State", {
      Enabled: undefined,
      Hovered: undefined,
      Focused: undefined,
      Pressed: undefined,
      Disabled: true,
    }),

    icon: figma.instance("↳ Icon"),
  },

  example: ({ size, color, disabled, icon }) => (
    <Fab size={size} color={color} disabled={disabled}>
      {/* Check the design and add an aria-label that describes the action. */}
      {icon}
    </Fab>
  ),

  links: [
    {
      name: "MUI Fab API",
      url: "https://mui.com/material-ui/api/fab/",
    },
  ],
});
