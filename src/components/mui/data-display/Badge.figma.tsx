import React from "react";
import { Badge } from "@mui/material";
import figma from "@figma/code-connect";

const badgeNode =
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6587%3A47500";

const badgeWithInstanceNode =
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6587%3A47527";

figma.connect(Badge, badgeNode, {
  props: {
    variant: figma.enum("Variant", {
      Standard: undefined,
      Dot: "dot",
    }),

    color: figma.enum("Color", {
      Default: "default",
      Primary: "primary",
      Secondary: "secondary",
      Error: "error",
      Warning: "warning",
      Info: "info",
      Success: "success",
    }),

    badgeContent: figma.string("Content"),
  },

  example: ({ variant, color, badgeContent }) => (
    <Badge variant={variant} color={color} badgeContent={badgeContent} />
  ),

  links: [
    {
      name: "MUI Badge API",
      url: "https://mui.com/material-ui/api/badge/",
    },
  ],
});

figma.connect(Badge, badgeWithInstanceNode, {
  props: {
    variant: figma.enum("Variant", {
      Standard: undefined,
      Dot: "dot",
    }),

    color: figma.enum("Color", {
      Default: "default",
      Primary: "primary",
      Secondary: "secondary",
      Error: "error",
      Warning: "warning",
      Info: "info",
      Success: "success",
    }),

    children: figma.instance("Component"),
  },

  example: ({ variant, color, children }) => (
    <Badge variant={variant} color={color} badgeContent=" ">
      {children}
    </Badge>
  ),

  links: [
    {
      name: "MUI Badge API",
      url: "https://mui.com/material-ui/api/badge/",
    },
  ],
});
