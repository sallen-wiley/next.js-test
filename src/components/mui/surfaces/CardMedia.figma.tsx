import React from "react";
import { CardMedia } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  CardMedia,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=11480%3A169332",
  {
    example: () => (
      <CardMedia
        component="img"
        height="140"
        image="/placeholder.jpg"
        alt="Card media"
      />
    ),

    links: [
      {
        name: "MUI CardMedia API",
        url: "https://mui.com/material-ui/api/card-media/",
      },
    ],
  },
);
