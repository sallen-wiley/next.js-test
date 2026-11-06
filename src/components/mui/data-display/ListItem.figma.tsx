import React from "react";
import { ListItem, ListItemText } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  ListItem,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6591%3A48882",
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
        Pressed: undefined,
        Disabled: true,
        FocusedSelected: undefined,
        HoverSelected: undefined,
      }),

      selected: figma.enum("State", {
        Enabled: undefined,
        Hovered: undefined,
        Selected: true,
        Focused: undefined,
        Pressed: undefined,
        Disabled: undefined,
        FocusedSelected: true,
        HoverSelected: true,
      }),

      label: figma.string("Label"),

      left: figma.boolean("Left Slot?", {
        true: figma.instance("Left Slot"),
        false: undefined,
      }),

      right: figma.boolean("Right Slot?", {
        true: figma.instance("Right Slot"),
        false: undefined,
      }),
    },

    example: ({
      dense,
      disableGutters,
      divider,
      disabled,
      selected,
      label,
      left,
      right,
    }) => (
      <ListItem
        dense={dense}
        disableGutters={disableGutters}
        divider={divider}
        disabled={disabled}
        selected={selected}
      >
        {left}
        <ListItemText primary={label} />
        {right}
      </ListItem>
    ),

    links: [
      {
        name: "MUI ListItem API",
        url: "https://mui.com/material-ui/api/list-item/",
      },
    ],
  },
);
