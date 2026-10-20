// src/components/mui/data-display/Typography.figma.tsx
import React from "react";
import { Typography } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Typography,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=11609%3A174872",
  {
    props: {
      variant: figma.enum("Variant", {
        // body1 is the MUI default.
        body1: undefined,
        body2: "body2",
        subtitle1: "subtitle1",
        subtitle2: "subtitle2",
        overline: "overline",
        caption: "caption",
        h6: "h6",
        h5: "h5",
        h4: "h4",
        h3: "h3",
        h2: "h2",
        h1: "h1",
        // Not a MUI variant. This library's custom uses the table/header text style.
        custom: undefined,
      }),

      gutterBottom: figma.enum("Gutter Bottom", {
        False: undefined,
        True: true,
      }),

      children: figma.string("Content"),
    },

    example: ({ variant, gutterBottom, children }) => (
      <Typography variant={variant} gutterBottom={gutterBottom}>
        {children}
      </Typography>
    ),

    links: [
      {
        name: "MUI Typography",
        url: "https://mui.com/material-ui/react-typography/",
      },
    ],
  },
);
