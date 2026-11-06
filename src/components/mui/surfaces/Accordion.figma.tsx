import React from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import figma from "@figma/code-connect";

// Accordion's Slot is open-host content — do not use children("*"). Emit the shell only.
figma.connect(
  Accordion,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6583%3A46084",
  {
    props: {
      disabled: figma.enum("Disabled", {
        False: undefined,
        True: true,
      }),

      expanded: figma.enum("Expanded?", {
        False: undefined,
        True: true,
      }),
    },

    example: ({ disabled, expanded }) => (
      <Accordion disabled={disabled} expanded={expanded}>
        {/* Check the design: AccordionSummary / AccordionDetails content is not mapped from the open slot. */}
        <AccordionSummary>Summary</AccordionSummary>
        <AccordionDetails>Details</AccordionDetails>
      </Accordion>
    ),

    links: [
      {
        name: "MUI Accordion API",
        url: "https://mui.com/material-ui/api/accordion/",
      },
    ],
  },
);
