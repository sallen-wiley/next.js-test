import React from "react";
import { List } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  List,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=11566%3A157133",
  {
    props: {
      dense: figma.enum("Dense", {
        False: undefined,
        True: true,
      }),

      disablePadding: figma.enum("Dis. Padding", {
        False: undefined,
        True: true,
      }),

      children: figma.children("*"),
    },

    example: ({ dense, disablePadding, children }) => (
      <List dense={dense} disablePadding={disablePadding}>
        {children}
      </List>
    ),

    links: [
      {
        name: "MUI List API",
        url: "https://mui.com/material-ui/api/list/",
      },
    ],
  },
);
