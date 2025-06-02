// src/figma/Button.figma.tsx
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

      startIcon: figma.instance("↳ Start Icon"),
      endIcon: figma.instance("↳ End Icon"),
    },

    example: ({
      color,
      disabled,
      size,
      variant,
      children,
      startIcon,
      endIcon,
    }: {
      color:
        | "inherit"
        | "primary"
        | "secondary"
        | "success"
        | "error"
        | "info"
        | "warning";
      disabled: boolean;
      size: "small" | "medium" | "large";
      variant: "text" | "outlined" | "contained";
      children: string;
      startIcon?: React.ReactNode;
      endIcon?: React.ReactNode;
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
