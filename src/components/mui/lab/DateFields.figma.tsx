import React from "react";
import { DateField, DateTimeField, TimeField } from "@mui/x-date-pickers";
import figma from "@figma/code-connect";

// Sparse: Figma only exposes Clearable. Pickers need a LocalizationProvider in real apps.

figma.connect(
  DateField,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=1174%3A13306",
  {
    props: {
      clearable: figma.enum("Clearable", {
        False: undefined,
        True: true,
      }),
    },

    example: ({ clearable }) => (
      <DateField label="Date" clearable={clearable} />
    ),

    links: [
      {
        name: "MUI DateField",
        url: "https://mui.com/x/react-date-pickers/date-field/",
      },
    ],
  },
);

figma.connect(
  TimeField,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=1268%3A106844",
  {
    props: {
      clearable: figma.enum("Clearable", {
        False: undefined,
        True: true,
      }),
    },

    example: ({ clearable }) => (
      <TimeField label="Time" clearable={clearable} />
    ),

    links: [
      {
        name: "MUI TimeField",
        url: "https://mui.com/x/react-date-pickers/time-field/",
      },
    ],
  },
);

figma.connect(
  DateTimeField,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=1251%3A806500",
  {
    props: {
      clearable: figma.enum("Clearable", {
        False: undefined,
        True: true,
      }),
    },

    example: ({ clearable }) => (
      <DateTimeField label="Date time" clearable={clearable} />
    ),

    links: [
      {
        name: "MUI DateTimeField",
        url: "https://mui.com/x/react-date-pickers/date-time-field/",
      },
    ],
  },
);
