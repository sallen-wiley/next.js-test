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
        Primary: "primary",
        Secondary: "secondary",
        Success: "success",
        Error: "error",
        Info: "info",
        Warning: "warning",
        White: "white",
        Black: "black",
        Neutral: "neutral",
      }),

      disabled: figma.enum("State", {
        Default: false,
        Disabled: true,
      }),

      size: figma.enum("Size", {
        Small: "small",
        Medium: "medium",
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
        true: figma.children("Icon Left"),
        false: undefined,
      }),

      endIcon: figma.boolean("End Icon", {
        true: figma.children("Icon Right"),
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
  }
);
