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

      // Figma State (Selected / Disabled / etc.) is visual-only on this
      // component. MUI ListItem no longer accepts selected/disabled — those
      // props exist on ListItemButton, which is not a UAX DS Figma component.
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

    example: ({ dense, disableGutters, divider, label, left, right }) => (
      <ListItem dense={dense} disableGutters={disableGutters} divider={divider}>
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
