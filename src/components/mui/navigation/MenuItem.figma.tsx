import React from "react";
import { MenuItem } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  MenuItem,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6576%3A50735",
  {
    props: {
      dense: figma.enum("Dense", {
        False: undefined,
        True: true,
      }),

      disableGutters: figma.enum("Dis. Gutters", {
        False: undefined,
        True: true,
      }),

      divider: figma.boolean("Divider"),

      disabled: figma.enum("State", {
        Enabled: undefined,
        Hovered: undefined,
        Selected: undefined,
        Focused: undefined,
        Disabled: true,
      }),

      selected: figma.enum("State", {
        Enabled: undefined,
        Hovered: undefined,
        Selected: true,
        Focused: undefined,
        Disabled: undefined,
      }),

      children: figma.string("Value"),

      leftIcon: figma.boolean("Left Slot", {
        true: figma.instance("Left Instance"),
        false: undefined,
      }),

      rightIcon: figma.boolean("Right Slot", {
        true: figma.instance("Right Instance"),
        false: undefined,
      }),
    },

    example: ({
      dense,
      disableGutters,
      divider,
      disabled,
      selected,
      children,
      leftIcon,
      rightIcon,
    }) => (
      <MenuItem
        dense={dense}
        disableGutters={disableGutters}
        divider={divider}
        disabled={disabled}
        selected={selected}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </MenuItem>
    ),

    links: [
      {
        name: "MUI MenuItem API",
        url: "https://mui.com/material-ui/api/menu-item/",
      },
    ],
  },
);
