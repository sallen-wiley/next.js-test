import React from "react";
import { Divider } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Divider,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6645%3A53005",
  {
    example: () => <Divider />,
    links: [
      {
        name: "MUI Divider API",
        url: "https://mui.com/material-ui/api/divider/",
      },
    ],
  },
);

figma.connect(
  Divider,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6645%3A53007",
  {
    example: () => <Divider orientation="vertical" flexItem />,
    links: [
      {
        name: "MUI Divider API",
        url: "https://mui.com/material-ui/api/divider/",
      },
    ],
  },
);
