import React from "react";
import figma from "@figma/code-connect";
import { AlternateButton } from "./AlternateButton";

figma.connect(
  AlternateButton,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6543%3A36744",
  {
    props: {
      children: figma.string("Label"),
    },
    example: ({ children }) => <AlternateButton>{children}</AlternateButton>,
  },
);
