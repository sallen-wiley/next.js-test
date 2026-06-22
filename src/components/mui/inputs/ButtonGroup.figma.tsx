// src/components/mui/inputs/ButtonGroup.figma.tsx
import React from "react";
import { ButtonGroup } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  ButtonGroup,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6543%3A39843",
  {
    props: {
      color: figma.enum("Color", {
        Inherit: "inherit",
        Primary: "primary",
        Secondary: "secondary",
        Success: "success",
        Error: "error",
        Info: "info",
        Warning: "warning",
      }),

      orientation: figma.enum("Orientation", {
        Horizontal: "horizontal",
        Vertical: "vertical",
      }),

      variant: figma.enum("Variant", {
        Text: "text",
        Outlined: "outlined",
        Contained: "contained",
      }),

      // Derive group size from the first nested Button instance.
      firstButton: figma.nestedProps("<Button>", {
        size: figma.enum("Size", {
          Small: "small",
          Medium: "medium",
          Large: "large",
        }),
      }),

      // Render any nested connected child instances (e.g. Button) from this group.
      children: figma.children("*"),
    },

    example: ({ color, orientation, variant, firstButton, children }) => (
      <ButtonGroup
        color={color}
        orientation={orientation}
        variant={variant}
        size={firstButton.size}
      >
        {children}
      </ButtonGroup>
    ),
  },
);
