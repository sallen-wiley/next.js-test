// src/components/mui/Button.figma.tsx
import React from "react";
import { Button } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Button,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6543%3A36744",
  {
    props: {
      color: figma.enum("Color", {
        Inherit: "inherit",
        "Inherit (white)": "inherit",
        Primary: "primary",
        Secondary: "secondary",
        Success: "success",
        Error: "error",
        Info: "info",
        Warning: "warning",
        White: "white",
        Black: "black",
      }),

      disabled: figma.enum("State", {
        Enabled: undefined,
        Hovered: undefined,
        Focused: undefined,
        Pressed: undefined,
        Disabled: true,
      }),

      size: figma.enum("Size", {
        Small: "small",
        Medium: undefined,
        Large: "large",
      }),

      variant: figma.enum("Variant", {
        Text: "text",
        Outlined: "outlined",
        Contained: "contained",
      }),

      children: figma.string("Label"),

      // Use your existing boolean properties to conditionally include icons
      startIcon: figma.boolean("Start Icon", {
        true: figma.instance("↳ Start Icon"),
        false: undefined,
      }),

      endIcon: figma.boolean("End Icon", {
        true: figma.instance("↳ End Icon"),
        false: undefined,
      }),
    },

    example: ({
      color,
      disabled,
      size,
      variant,
      children,
      startIcon,
      endIcon,
    }) => (
      <Button
        color={color}
        disabled={disabled}
        size={size}
        variant={variant}
        startIcon={startIcon}
        endIcon={endIcon}
      >
        {children}
      </Button>
    ),
  },
);
