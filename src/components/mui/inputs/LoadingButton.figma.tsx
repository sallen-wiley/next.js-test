import React from "react";
import { Button } from "@mui/material";
import figma from "@figma/code-connect";

// Figma <LoadingButton> maps to MUI Button's loading props (LoadingButton was folded into Button).
figma.connect(
  Button,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=1634%3A70207",
  {
    props: {
      size: figma.enum("Size", {
        Small: "small",
        Medium: undefined,
        Large: "large",
      }),

      variant: figma.enum("Variant", {
        Contained: "contained",
        Outlined: "outlined",
        Text: "text",
      }),

      children: figma.string("Label"),

      loading: figma.boolean("Loading Start", {
        true: true,
        false: figma.boolean("Loading End", {
          true: true,
          false: undefined,
        }),
      }),

      loadingPosition: figma.boolean("Loading End", {
        true: "end" as const,
        false: figma.boolean("Loading Start", {
          true: "start" as const,
          false: undefined,
        }),
      }),
    },

    example: ({ size, variant, children, loading, loadingPosition }) => (
      <Button
        size={size}
        variant={variant}
        loading={loading}
        loadingPosition={loadingPosition}
      >
        {children}
      </Button>
    ),

    links: [
      {
        name: "MUI Button API (loading)",
        url: "https://mui.com/material-ui/api/button/",
      },
    ],
  },
);
