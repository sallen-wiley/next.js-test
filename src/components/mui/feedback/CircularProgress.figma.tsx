import React from "react";
import { CircularProgress } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  CircularProgress,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6586%3A47016",
  {
    props: {
      color: figma.enum("Color", {
        Primary: undefined,
        Secondary: "secondary",
        Inherit: "inherit",
      }),

      size: figma.enum("Size", {
        "32px": undefined,
        "16px": 16,
      }),
    },

    example: ({ color, size }) => (
      <CircularProgress color={color} size={size} />
    ),

    links: [
      {
        name: "MUI CircularProgress API",
        url: "https://mui.com/material-ui/api/circular-progress/",
      },
    ],
  },
);
