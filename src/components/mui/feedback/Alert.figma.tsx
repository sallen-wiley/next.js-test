import React from "react";
import { Alert } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Alert,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6595%3A48211",
  {
    props: {
      severity: figma.enum("Severity", {
        Error: "error",
        Warning: "warning",
        Info: "info",
        Success: "success",
      }),

      variant: figma.enum("Variant", {
        Filled: "filled",
        Outlined: "outlined",
        Standard: undefined,
      }),

      title: figma.boolean("Title?", {
        true: figma.string("↳ Title"),
        false: undefined,
      }),

      description: figma.boolean("Description?", {
        true: figma.string("↳ Description"),
        false: undefined,
      }),

      onClose: figma.boolean("On Close?", {
        true: () => {},
        false: undefined,
      }),

      action: figma.boolean("Action?", {
        true: figma.instance("↳Instance"),
        false: undefined,
      }),
    },

    example: ({ severity, variant, title, description, onClose, action }) => (
      <Alert
        severity={severity}
        variant={variant}
        onClose={onClose}
        action={action}
      >
        {/* Check the design: wrap the title in <AlertTitle> when both title and description are present. */}
        {title}
        {description}
      </Alert>
    ),

    links: [
      {
        name: "MUI Alert API",
        url: "https://mui.com/material-ui/api/alert/",
      },
    ],
  },
);
