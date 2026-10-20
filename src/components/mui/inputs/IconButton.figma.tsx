// src/components/mui/inputs/IconButton.figma.tsx
import React from "react";
import { IconButton } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  IconButton,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6557%3A38545",
  {
    props: {
      size: figma.enum("Size", {
        Small: "small",
        Medium: undefined,
        Large: "large",
      }),

      color: figma.enum("Color", {
        Default: undefined,
        Primary: "primary",
        Secondary: "secondary",
        Error: "error",
        Warning: "warning",
        Info: "info",
        Success: "success",
        Inherit: "inherit",
        "Inherit (white)": "inherit",
      }),

      disabled: figma.enum("State", {
        Enabled: undefined,
        Hovered: undefined,
        Focused: undefined,
        Pressed: undefined,
        Disabled: true,
      }),

      icon: figma.children("<Icon>"),
    },

    example: ({ size, color, disabled, icon }) => (
      <IconButton size={size} color={color} disabled={disabled}>
        {/* Check the design and add an aria-label that describes the action. */}
        {icon}
      </IconButton>
    ),

    links: [
      {
        name: "MUI IconButton",
        url: "https://mui.com/material-ui/api/icon-button/",
      },
    ],
  },
);
