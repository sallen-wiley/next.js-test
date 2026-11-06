import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  BottomNavigation,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6572%3A50307",
  {
    props: {
      showLabels: figma.enum("Icon Only", {
        False: true,
        True: false,
      }),

      children: figma.children("*"),
    },

    example: ({ showLabels, children }) => (
      <BottomNavigation showLabels={showLabels}>{children}</BottomNavigation>
    ),

    links: [
      {
        name: "MUI BottomNavigation API",
        url: "https://mui.com/material-ui/api/bottom-navigation/",
      },
    ],
  },
);

figma.connect(
  BottomNavigationAction,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6572%3A50288",
  {
    props: {
      label: figma.enum("Label", {
        True: figma.string("Label Content"),
        False: undefined,
      }),

      disabled: figma.enum("State", {
        Enabled: undefined,
        Focused: undefined,
        Disabled: true,
        Pressed: undefined,
      }),
    },

    example: ({ label, disabled }) => (
      <BottomNavigationAction label={label} disabled={disabled} />
    ),

    links: [
      {
        name: "MUI BottomNavigationAction API",
        url: "https://mui.com/material-ui/api/bottom-navigation-action/",
      },
    ],
  },
);
