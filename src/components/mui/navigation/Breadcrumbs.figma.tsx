import React from "react";
import { Breadcrumbs } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Breadcrumbs,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6572%3A50436",
  {
    props: {
      maxItems: figma.enum("Collapsed", {
        False: undefined,
        True: 2,
      }),

      children: figma.children("*"),
    },

    example: ({ maxItems, children }) => (
      <Breadcrumbs maxItems={maxItems}>{children}</Breadcrumbs>
    ),

    links: [
      {
        name: "MUI Breadcrumbs API",
        url: "https://mui.com/material-ui/api/breadcrumbs/",
      },
    ],
  },
);
