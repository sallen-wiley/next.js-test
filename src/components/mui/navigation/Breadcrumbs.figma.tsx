import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Breadcrumbs } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Breadcrumbs,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6572%3A50436",
  {
    // JSX in the Separator enum is not auto-traced into imports.
    imports: [
      'import { Breadcrumbs } from "@mui/material";',
      'import ChevronRightIcon from "@mui/icons-material/ChevronRight";',
    ],

    props: {
      // Figma only exposes Collapsed True/False; slot length cannot drive an exact
      // maxItems, so True uses a fixed collapsed value of 2.
      maxItems: figma.enum("Collapsed", {
        False: undefined,
        True: 2,
      }),

      // Custom always uses the library chevron; do not resolve the nested icon instance.
      separator: figma.enum("Separator", {
        Default: undefined,
        Custom: <ChevronRightIcon fontSize="small" />,
      }),

      // Match crumb items only — Separator / Collapsed chrome must not enter children.
      children: figma.children("<Link>"),
    },

    example: ({ maxItems, separator, children }) => (
      <Breadcrumbs maxItems={maxItems} separator={separator}>
        {/* Check the design: Code snippets will not be perfect. Custom Separator only supports the right chevron; Collapsed defaults to maxItems={2} — use the design for the specific maxItems value. */}
        {children}
      </Breadcrumbs>
    ),

    links: [
      {
        name: "MUI Breadcrumbs API",
        url: "https://mui.com/material-ui/api/breadcrumbs/",
      },
      {
        name: "MUI Breadcrumbs guide",
        url: "https://mui.com/material-ui/react-breadcrumbs/",
      },
    ],
  },
);
