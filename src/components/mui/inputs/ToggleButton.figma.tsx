import React from "react";
import { ToggleButton } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  ToggleButton,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6601%3A50975",
  {
    props: {
      // Always-on TEXT prop — used as MUI `value` even when the label is hidden (icon-only).
      value: figma.string("Value"),

      size: figma.enum("Size", {
        Small: "small",
        Medium: undefined,
        Large: "large",
      }),

      disabled: figma.enum("State", {
        Enabled: undefined,
        Hovered: undefined,
        Focused: undefined,
        Pressed: undefined,
        Disabled: true,
      }),

      selected: figma.enum("Selected", {
        False: undefined,
        True: true,
      }),

      icon: figma.boolean("Icon?", {
        true: figma.instance("Icon"),
        false: undefined,
      }),

      text: figma.boolean("Text?", {
        true: figma.string("Value"),
        false: undefined,
      }),
    },

    example: ({ value, size, disabled, selected, icon, text }) => (
      <ToggleButton
        value={value}
        size={size}
        disabled={disabled}
        selected={selected}
      >
        {icon}
        {text}
      </ToggleButton>
    ),

    links: [
      {
        name: "MUI ToggleButton API",
        url: "https://mui.com/material-ui/api/toggle-button/",
      },
    ],
  },
);
