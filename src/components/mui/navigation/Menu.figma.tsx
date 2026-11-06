import React from "react";
import { Menu, MenuList } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Menu,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=11402%3A158079",
  {
    props: {
      children: figma.children("*"),
    },

    example: ({ children }) => (
      <Menu open anchorEl={null}>
        {children}
      </Menu>
    ),

    links: [
      {
        name: "MUI Menu API",
        url: "https://mui.com/material-ui/api/menu/",
      },
    ],
  },
);

figma.connect(
  MenuList,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=11404%3A174321",
  {
    props: {
      dense: figma.enum("Dense", {
        False: undefined,
        True: true,
      }),

      children: figma.children("*"),
    },

    example: ({ dense, children }) => (
      <MenuList dense={dense}>{children}</MenuList>
    ),

    links: [
      {
        name: "MUI MenuList API",
        url: "https://mui.com/material-ui/api/menu-list/",
      },
    ],
  },
);
