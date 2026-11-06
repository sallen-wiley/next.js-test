import React from "react";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import figma from "@figma/code-connect";

figma.connect(
  Timeline,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6602%3A51689",
  {
    props: {
      position: figma.enum("Position", {
        Right: "right",
        Left: "left",
        Alternating: "alternate",
      }),

      children: figma.children("*"),
    },

    example: ({ position, children }) => (
      <Timeline position={position}>{children}</Timeline>
    ),

    links: [
      {
        name: "MUI Timeline",
        url: "https://mui.com/material-ui/react-timeline/",
      },
    ],
  },
);

figma.connect(
  TimelineItem,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6602%3A51383",
  {
    props: {
      position: figma.enum("Position", {
        Right: "right",
        Left: "left",
      }),
    },

    example: ({ position }) => (
      <TimelineItem position={position}>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Event</TimelineContent>
      </TimelineItem>
    ),

    links: [
      {
        name: "MUI TimelineItem",
        url: "https://mui.com/material-ui/api/timeline-item/",
      },
    ],
  },
);

figma.connect(
  TimelineDot,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6602%3A51786",
  {
    props: {
      variant: figma.enum("Variant", {
        "Filled*": undefined,
        Outlined: "outlined",
      }),
    },

    example: ({ variant }) => <TimelineDot variant={variant} />,

    links: [
      {
        name: "MUI TimelineDot API",
        url: "https://mui.com/material-ui/api/timeline-dot/",
      },
    ],
  },
);

figma.connect(
  TimelineConnector,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6655%3A52199",
  {
    example: () => <TimelineConnector />,
    links: [
      {
        name: "MUI TimelineConnector API",
        url: "https://mui.com/material-ui/api/timeline-connector/",
      },
    ],
  },
);
