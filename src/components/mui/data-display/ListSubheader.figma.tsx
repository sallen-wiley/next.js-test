import React from "react";
import { ListSubheader } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  ListSubheader,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6645%3A59769",
  {
    example: () => <ListSubheader>Subheader</ListSubheader>,
    links: [
      {
        name: "MUI ListSubheader API",
        url: "https://mui.com/material-ui/api/list-subheader/",
      },
    ],
  },
);
