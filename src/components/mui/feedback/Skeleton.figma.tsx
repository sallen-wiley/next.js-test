import React from "react";
import { Skeleton } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Skeleton,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6596%3A49017",
  {
    props: {
      variant: figma.enum("Shape", {
        Text: "text",
        Circle: "circular",
        Rectangle: "rectangular",
      }),
    },

    example: ({ variant }) => <Skeleton variant={variant} width={210} height={60} />,

    links: [
      {
        name: "MUI Skeleton API",
        url: "https://mui.com/material-ui/api/skeleton/",
      },
    ],
  },
);
