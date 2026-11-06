import React from "react";
import { CardHeader } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  CardHeader,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6583%3A46537",
  {
    props: {
      title: figma.string("Header"),

      subheader: figma.boolean("Subheader?", {
        true: figma.string("↳ Value"),
        false: undefined,
      }),

      action: figma.boolean("Right Action?", {
        true: figma.instance("↳ Instance"),
        false: undefined,
      }),
    },

    example: ({ title, subheader, action }) => (
      <CardHeader title={title} subheader={subheader} action={action} />
    ),

    links: [
      {
        name: "MUI CardHeader API",
        url: "https://mui.com/material-ui/api/card-header/",
      },
    ],
  },
);
