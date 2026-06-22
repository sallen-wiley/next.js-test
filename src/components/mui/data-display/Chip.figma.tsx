// src/components/mui/data-display/Chip.figma.tsx
import React from "react";
import { Avatar, Chip } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Chip,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6588%3A47683",
  {
    props: {
      color: figma.enum("Color", {
        Default: "default",
        Primary: "primary",
        Secondary: "secondary",
        Success: "success",
        Error: "error",
        Info: "info",
        Warning: "warning",
        Neutral: "neutral",
      }),

      disabled: figma.enum("State", {
        Enabled: false,
        Hovered: false,
        Focused: false,
        Pressed: false,
        Disabled: true,
      }),

      size: figma.enum("Size", {
        Small: "small",
        Medium: "medium",
      }),

      variant: figma.enum("Variant", {
        Filled: "filled",
        Outlined: "outlined",
      }),

      label: figma.string("Label"),

      onDelete: figma.boolean("Delete?", {
        true: () => {},
        false: undefined,
      }),

      avatar: figma.boolean("Thumbnail?", {
        true: <Avatar>OP</Avatar>,
        false: undefined,
      }),
    },

    example: ({ color, disabled, size, variant, label, onDelete, avatar }) => (
      <Chip
        color={color}
        disabled={disabled}
        size={size}
        variant={variant}
        label={label}
        onDelete={onDelete}
        avatar={avatar}
      />
    ),
  },
);
