import React from "react";
import { Rating } from "@mui/material";
import figma from "@figma/code-connect";

// Figma only exposes Size and Disabled. Nested Star instances are visual only —
// there is no value/precision property to map. Star is not a separate MUI component.
figma.connect(
  Rating,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6562%3A39624",
  {
    props: {
      size: figma.enum("Size", {
        Small: "small",
        "Medium*": undefined,
        Large: "large",
      }),

      disabled: figma.enum("Disabled", {
        False: undefined,
        True: true,
      }),
    },

    example: ({ size, disabled }) => (
      // Check the design: set value / defaultValue / precision from the filled stars.
      <Rating size={size} disabled={disabled} />
    ),

    links: [
      {
        name: "MUI Rating API",
        url: "https://mui.com/material-ui/api/rating/",
      },
    ],
  },
);
