import React from "react";
import { ToggleButtonGroup } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  ToggleButtonGroup,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6601%3A51012",
  {
    props: {
      orientation: figma.enum("Orientation", {
        Horizontal: undefined,
        Vertical: "vertical",
      }),

      size: figma.enum("Size", {
        Small: "small",
        Medium: undefined,
        Large: "large",
      }),

      // Slot `toggleButtons` — match connected ToggleButton instances by layer name.
      children: figma.children("<ToggleButton>"),
    },

    example: ({ orientation, size, children }) => (
      // Check the design: set ToggleButtonGroup value from the selected button(s)
      // (child `value` props) and wire onChange; exclusive is the library default.
      <ToggleButtonGroup orientation={orientation} size={size} exclusive>
        {children}
      </ToggleButtonGroup>
    ),

    links: [
      {
        name: "MUI ToggleButtonGroup API",
        url: "https://mui.com/material-ui/api/toggle-button-group/",
      },
    ],
  },
);
