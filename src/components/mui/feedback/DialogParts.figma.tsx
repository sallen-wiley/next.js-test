import React from "react";
import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import figma from "@figma/code-connect";

// Dialog itself is an open host — map closed parts only.

figma.connect(
  DialogTitle,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6643%3A52210",
  {
    props: {
      closeIcon: figma.boolean("Show close", {
        true: figma.instance("Instance"),
        false: undefined,
      }),
    },

    example: ({ closeIcon }) => (
      <DialogTitle>
        Title
        {closeIcon}
      </DialogTitle>
    ),

    links: [
      {
        name: "MUI DialogTitle API",
        url: "https://mui.com/material-ui/api/dialog-title/",
      },
    ],
  },
);

figma.connect(
  DialogContent,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=127%3A59928",
  {
    props: {
      dividers: figma.enum("Dividers?", {
        False: undefined,
        True: true,
      }),
    },

    example: ({ dividers }) => (
      <DialogContent dividers={dividers}>
        {/* Check the design: DialogContent slot body is not mapped. */}
        Content
      </DialogContent>
    ),

    links: [
      {
        name: "MUI DialogContent API",
        url: "https://mui.com/material-ui/api/dialog-content/",
      },
    ],
  },
);

figma.connect(
  DialogActions,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=1953%3A117199",
  {
    props: {
      children: figma.children("*"),
    },

    example: ({ children }) => <DialogActions>{children}</DialogActions>,

    links: [
      {
        name: "MUI DialogActions API",
        url: "https://mui.com/material-ui/api/dialog-actions/",
      },
    ],
  },
);
