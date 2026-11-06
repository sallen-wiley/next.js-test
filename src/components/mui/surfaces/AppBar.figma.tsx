import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  AppBar,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=11545%3A171494",
  {
    props: {
      color: figma.enum("Color", {
        Default: "default",
        Primary: undefined,
        Secondary: "secondary",
        "Inherit White": "inherit",
        Transparent: "transparent",
      }),

      children: figma.children("*"),
    },

    example: ({ color, children }) => (
      <AppBar position="static" color={color}>
        {children}
      </AppBar>
    ),

    links: [
      {
        name: "MUI AppBar API",
        url: "https://mui.com/material-ui/api/app-bar/",
      },
    ],
  },
);

figma.connect(
  Toolbar,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6583%3A46318",
  {
    props: {
      variant: figma.enum("Variant", {
        Regular: undefined,
        Dense: "dense",
      }),

      children: figma.children("*"),
    },

    example: ({ variant, children }) => (
      <Toolbar variant={variant}>{children}</Toolbar>
    ),

    links: [
      {
        name: "MUI Toolbar API",
        url: "https://mui.com/material-ui/api/toolbar/",
      },
    ],
  },
);
