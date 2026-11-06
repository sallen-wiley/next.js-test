import React from "react";
import { MobileStepper, Step, StepLabel, Stepper } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Stepper,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6576%3A51106",
  {
    props: {
      orientation: figma.enum("Alignment", {
        "Horizontal*": undefined,
        Vertical: "vertical",
      }),

      alternativeLabel: figma.enum("Text", {
        Center: true,
        Left: undefined,
      }),

      children: figma.children("*"),
    },

    example: ({ orientation, alternativeLabel, children }) => (
      <Stepper
        activeStep={1}
        orientation={orientation}
        alternativeLabel={alternativeLabel}
      >
        {children}
      </Stepper>
    ),

    links: [
      {
        name: "MUI Stepper API",
        url: "https://mui.com/material-ui/api/stepper/",
      },
    ],
  },
);

figma.connect(
  Step,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6576%3A50986",
  {
    props: {
      title: figma.string("Step Title Content"),

      optional: figma.boolean("Optional", {
        true: figma.string("Optional Content"),
        false: undefined,
      }),

      active: figma.enum("State", {
        Active: true,
        Inactive: undefined,
        Complete: undefined,
        Error: undefined,
        Warning: undefined,
        Info: undefined,
        Success: undefined,
      }),

      completed: figma.enum("State", {
        Active: undefined,
        Inactive: undefined,
        Complete: true,
        Error: undefined,
        Warning: undefined,
        Info: undefined,
        Success: undefined,
      }),
    },

    example: ({ title, optional, active, completed }) => (
      <Step active={active} completed={completed}>
        <StepLabel optional={optional}>{title}</StepLabel>
      </Step>
    ),

    links: [
      {
        name: "MUI Step API",
        url: "https://mui.com/material-ui/api/step/",
      },
    ],
  },
);

figma.connect(
  MobileStepper,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6576%3A51238",
  {
    props: {
      variant: figma.enum("Progress Type", {
        Text: "text",
        Dots: "dots",
        Progress: "progress",
      }),
    },

    example: ({ variant }) => (
      <MobileStepper
        variant={variant}
        steps={6}
        position="static"
        activeStep={2}
        nextButton={<span />}
        backButton={<span />}
      />
    ),

    links: [
      {
        name: "MUI MobileStepper API",
        url: "https://mui.com/material-ui/api/mobile-stepper/",
      },
    ],
  },
);
