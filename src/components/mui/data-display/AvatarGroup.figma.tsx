import React from "react";
import { AvatarGroup } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  AvatarGroup,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=7432%3A52415",
  {
    props: {
      max: figma.enum("Max", {
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
      }),

      spacing: figma.enum("Spacing", {
        Medium: "medium",
        Small: "small",
        Number: undefined,
      }),

      children: figma.children("*"),
    },

    example: ({ max, spacing, children }) => (
      <AvatarGroup max={max} spacing={spacing}>
        {children}
      </AvatarGroup>
    ),

    links: [
      {
        name: "MUI AvatarGroup API",
        url: "https://mui.com/material-ui/api/avatar-group/",
      },
    ],
  },
);
