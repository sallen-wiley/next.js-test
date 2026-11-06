import React from "react";
import { ImageListItemBar } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  ImageListItemBar,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=1606%3A8880",
  {
    props: {
      title: figma.boolean("Title?", {
        true: figma.string("Title"),
        false: undefined,
      }),

      subtitle: figma.boolean("Subtitle?", {
        true: figma.string("Subtitle"),
        false: undefined,
      }),

      actionIcon: figma.boolean("Action?", {
        true: figma.instance("↳ Action"),
        false: undefined,
      }),

      actionPosition: figma.enum("Action Position", {
        Left: "left",
        Right: undefined,
      }),
    },

    example: ({ title, subtitle, actionIcon, actionPosition }) => (
      <ImageListItemBar
        title={title}
        subtitle={subtitle}
        actionIcon={actionIcon}
        actionPosition={actionPosition}
      />
    ),

    links: [
      {
        name: "MUI ImageListItemBar API",
        url: "https://mui.com/material-ui/api/image-list-item-bar/",
      },
    ],
  },
);
