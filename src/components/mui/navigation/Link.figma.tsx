import React from "react";
import { Link } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Link,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6574%3A50682",
  {
    props: {
      color: figma.enum("Color", {
        Primary: "primary",
        Inherit: "inherit",
      }),

      underline: figma.enum("Underline", {
        Always: "always",
        Hover: "hover",
        None: "none",
      }),
    },

    example: ({ color, underline }) => (
      <Link href="#" color={color} underline={underline}>
        Link
      </Link>
    ),

    links: [
      {
        name: "MUI Link API",
        url: "https://mui.com/material-ui/api/link/",
      },
    ],
  },
);
