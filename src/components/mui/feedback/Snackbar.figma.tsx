import React from "react";
import { Snackbar, SnackbarContent } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Snackbar,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=11501%3A188958",
  {
    example: () => (
      <Snackbar open message="Message" />
    ),

    links: [
      {
        name: "MUI Snackbar API",
        url: "https://mui.com/material-ui/api/snackbar/",
      },
    ],
  },
);

figma.connect(
  SnackbarContent,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6586%3A47085",
  {
    props: {
      message: figma.string("Message"),
      action: figma.children("*"),
    },

    example: ({ message, action }) => (
      <SnackbarContent message={message} action={action} />
    ),

    links: [
      {
        name: "MUI SnackbarContent API",
        url: "https://mui.com/material-ui/api/snackbar-content/",
      },
    ],
  },
);
