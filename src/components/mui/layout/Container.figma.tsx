// src/components/mui/layout/Container.figma.tsx
// UNPUBLISHED on purpose (2026-09-22): Container is an open host.
// `figma.children("*")` silently drops unmapped slot content on screen
// handoff. File kept as a record; excluded from figma.config.json so a
// full publish does not restore it. Revisit only if slot children are a
// closed, already-mapped set.
// maxWidth stays explicit (including MUI's "lg" default) because width is the point of a layout container.
import React from "react";
import { Container } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Container,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=2213%3A290",
  {
    props: {
      maxWidth: figma.enum("Max width", {
        xs: "xs",
        sm: "sm",
        md: "md",
        lg: "lg",
        xl: "xl",
        false: false,
      }),

      fixed: figma.enum("Fixed", {
        true: true,
        false: undefined,
      }),

      disableGutters: figma.enum("Disable Gutters", {
        true: true,
        false: undefined,
      }),

      children: figma.children("*"),
    },

    example: ({ maxWidth, fixed, disableGutters, children }) => (
      <Container
        maxWidth={maxWidth}
        fixed={fixed}
        disableGutters={disableGutters}
      >
        {children}
      </Container>
    ),

    links: [
      {
        name: "MUI Container API",
        url: "https://mui.com/material-ui/api/container/",
      },
    ],
  },
);
