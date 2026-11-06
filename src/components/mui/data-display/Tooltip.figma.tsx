import React from "react";
import { Tooltip } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Tooltip,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6590%3A48770",
  {
    props: {
      placement: figma.enum("Direction", {
        None: undefined,
        Down: "bottom",
        Up: "top",
        Left: "left",
        Right: "right",
      }),
    },

    example: ({ placement }) => (
      <Tooltip title="Tooltip" placement={placement} open>
        <span>Anchor</span>
      </Tooltip>
    ),

    links: [
      {
        name: "MUI Tooltip API",
        url: "https://mui.com/material-ui/api/tooltip/",
      },
    ],
  },
);
