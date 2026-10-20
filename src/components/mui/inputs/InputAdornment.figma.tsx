import React from "react";
import { InputAdornment } from "@mui/material";
import figma from "@figma/code-connect";

const figmaNode =
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=2565%3A5754";

figma.connect(InputAdornment, figmaNode, {
  variant: {
    Type: "Icon",
  },

  props: {
    position: figma.enum("Position", {
      Start: "start",
      End: "end",
    }),

    icon: figma.children("<Icon>"),
  },

  example: ({ position, icon }) => (
    <InputAdornment position={position}>{icon}</InputAdornment>
  ),

  links: [
    {
      name: "MUI InputAdornment API",
      url: "https://mui.com/material-ui/api/input-adornment/",
    },
  ],
});

figma.connect(InputAdornment, figmaNode, {
  variant: {
    Type: "Text",
  },

  props: {
    position: figma.enum("Position", {
      Start: "start",
      End: "end",
    }),

    children: figma.string("Text"),
  },

  example: ({ position, children }) => (
    <InputAdornment position={position}>{children}</InputAdornment>
  ),

  links: [
    {
      name: "MUI InputAdornment API",
      url: "https://mui.com/material-ui/api/input-adornment/",
    },
  ],
});
