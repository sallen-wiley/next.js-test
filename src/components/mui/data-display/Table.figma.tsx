import React from "react";
import {
  Table,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Table,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6594%3A46634",
  {
    props: {
      size: figma.enum("Small", {
        False: undefined,
        True: "small",
      }),

      children: figma.children("*"),
    },

    example: ({ size, children }) => <Table size={size}>{children}</Table>,

    links: [
      {
        name: "MUI Table API",
        url: "https://mui.com/material-ui/api/table/",
      },
    ],
  },
);

figma.connect(
  TableCell,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6594%3A46413",
  {
    props: {
      size: figma.enum("Small", {
        False: undefined,
        True: "small",
      }),

      children: figma.children("*"),
    },

    example: ({ size, children }) => (
      <TableCell size={size}>{children}</TableCell>
    ),

    links: [
      {
        name: "MUI TableCell API",
        url: "https://mui.com/material-ui/api/table-cell/",
      },
    ],
  },
);

figma.connect(
  TableRow,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6594%3A46473",
  {
    props: {
      hover: figma.enum("Hover", {
        False: undefined,
        True: true,
      }),

      selected: figma.enum("Selected", {
        False: undefined,
        True: true,
      }),

      children: figma.children("*"),
    },

    example: ({ hover, selected, children }) => (
      <TableRow hover={hover} selected={selected}>
        {children}
      </TableRow>
    ),

    links: [
      {
        name: "MUI TableRow API",
        url: "https://mui.com/material-ui/api/table-row/",
      },
    ],
  },
);

figma.connect(
  TableCell,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6594%3A46364",
  {
    props: {
      size: figma.enum("Small", {
        False: undefined,
        True: "small",
      }),

      children: figma.string("Label"),
    },

    example: ({ size, children }) => (
      <TableCell size={size} variant="head">
        {children}
      </TableCell>
    ),

    links: [
      {
        name: "MUI TableCell API",
        url: "https://mui.com/material-ui/api/table-cell/",
      },
    ],
  },
);

figma.connect(
  TableRow,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6686%3A36863",
  {
    props: {
      selected: figma.enum("Selected", {
        False: undefined,
        True: true,
      }),

      children: figma.children("*"),
    },

    example: ({ selected, children }) => (
      <TableHead>
        <TableRow selected={selected}>{children}</TableRow>
      </TableHead>
    ),

    links: [
      {
        name: "MUI TableRow API",
        url: "https://mui.com/material-ui/api/table-row/",
      },
    ],
  },
);

figma.connect(
  TableFooter,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6645%3A61374",
  {
    example: () => (
      <TableFooter>
        <TableRow>
          <TableCell>Footer</TableCell>
        </TableRow>
      </TableFooter>
    ),

    links: [
      {
        name: "MUI TableFooter API",
        url: "https://mui.com/material-ui/api/table-footer/",
      },
    ],
  },
);
