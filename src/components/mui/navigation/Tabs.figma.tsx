import React from "react";
import { Tab, Tabs } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Tabs,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6579%3A45197",
  {
    props: {
      orientation: figma.enum("Orientation", {
        Horizontal: undefined,
        Vertical: "vertical",
      }),

      variant: figma.enum("Variant", {
        Standard: undefined,
        Scrollable: "scrollable",
        "Full Width": "fullWidth",
      }),

      children: figma.children("*"),
    },

    example: ({ orientation, variant, children }) => (
      <Tabs orientation={orientation} variant={variant} value={0}>
        {children}
      </Tabs>
    ),

    links: [
      {
        name: "MUI Tabs API",
        url: "https://mui.com/material-ui/api/tabs/",
      },
    ],
  },
);

figma.connect(
  Tab,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6579%3A45104",
  {
    props: {
      label: figma.boolean("Text", {
        true: figma.string("Tab Content"),
        false: undefined,
      }),

      icon: figma.boolean("Icon", {
        true: figma.children("<Icon>"),
        false: undefined,
      }),

      iconPosition: figma.enum("Icon Position", {
        Up: "top",
        Left: "start",
        Right: "end",
      }),

      disabled: figma.enum("State", {
        Enabled: undefined,
        Disabled: true,
        Focused: undefined,
        Pressed: undefined,
      }),
    },

    example: ({ label, icon, iconPosition, disabled }) => (
      <Tab
        label={label}
        icon={icon}
        iconPosition={iconPosition}
        disabled={disabled}
      />
    ),

    links: [
      {
        name: "MUI Tab API",
        url: "https://mui.com/material-ui/api/tab/",
      },
    ],
  },
);
