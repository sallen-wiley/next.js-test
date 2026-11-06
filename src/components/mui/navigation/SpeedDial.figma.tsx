import React from "react";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  SpeedDial,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6599%3A50822",
  {
    props: {
      direction: figma.enum("Direction", {
        Up: undefined,
        Left: "left",
        Right: "right",
        Down: "down",
      }),

      children: figma.children("*"),
    },

    example: ({ direction, children }) => (
      <SpeedDial
        ariaLabel="SpeedDial"
        direction={direction}
        open
        icon={<span />}
      >
        {children}
      </SpeedDial>
    ),

    links: [
      {
        name: "MUI SpeedDial API",
        url: "https://mui.com/material-ui/api/speed-dial/",
      },
    ],
  },
);

figma.connect(
  SpeedDialAction,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=7618%3A74537",
  {
    props: {
      tooltipTitle: figma.boolean("Tooltip", {
        true: "Action",
        false: undefined,
      }),
    },

    example: ({ tooltipTitle }) => (
      <SpeedDialAction icon={<span />} tooltipTitle={tooltipTitle} />
    ),

    links: [
      {
        name: "MUI SpeedDialAction API",
        url: "https://mui.com/material-ui/api/speed-dial-action/",
      },
    ],
  },
);
