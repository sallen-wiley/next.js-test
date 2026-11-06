import React from "react";
import { Pagination, PaginationItem } from "@mui/material";
import figma from "@figma/code-connect";

figma.connect(
  Pagination,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6598%3A49376",
  {
    props: {
      size: figma.enum("Size", {
        Medium: undefined,
        Large: "large",
        Small: "small",
      }),

      color: figma.enum("Color", {
        Standard: undefined,
        Primary: "primary",
        Secondary: "secondary",
      }),

      variant: figma.enum("Variant", {
        Text: undefined,
        Outlined: "outlined",
      }),

      shape: figma.enum("Shape", {
        Circular: undefined,
        Rounded: "rounded",
      }),

      disabled: figma.enum("Disabled", {
        False: undefined,
        True: true,
      }),

      hideNextButton: figma.boolean("Hide Next Button"),
      hidePrevButton: figma.boolean("Hide Prev Button"),
      showFirstButton: figma.boolean("Show First Button"),
      showLastButton: figma.boolean("Show Last Button"),
    },

    example: ({
      size,
      color,
      variant,
      shape,
      disabled,
      hideNextButton,
      hidePrevButton,
      showFirstButton,
      showLastButton,
    }) => (
      <Pagination
        count={10}
        size={size}
        color={color}
        variant={variant}
        shape={shape}
        disabled={disabled}
        hideNextButton={hideNextButton}
        hidePrevButton={hidePrevButton}
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
      />
    ),

    links: [
      {
        name: "MUI Pagination API",
        url: "https://mui.com/material-ui/api/pagination/",
      },
    ],
  },
);

figma.connect(
  PaginationItem,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6598%3A49207",
  {
    props: {
      size: figma.enum("Size", {
        Large: "large",
        Medium: undefined,
        Small: "small",
      }),

      variant: figma.enum("Variant", {
        Text: undefined,
        Outlined: "outlined",
      }),

      shape: figma.enum("Shape", {
        Circular: undefined,
        Rounded: "rounded",
      }),

      color: figma.enum("Color", {
        "Standard*": undefined,
        Primary: "primary",
        Secondary: "secondary",
      }),

      disabled: figma.enum("Disabled", {
        False: undefined,
        True: true,
      }),

      selected: figma.enum("Active", {
        True: true,
        False: undefined,
      }),
    },

    example: ({ size, variant, shape, color, disabled, selected }) => (
      <PaginationItem
        page={1}
        size={size}
        variant={variant}
        shape={shape}
        color={color}
        disabled={disabled}
        selected={selected}
      />
    ),

    links: [
      {
        name: "MUI PaginationItem API",
        url: "https://mui.com/material-ui/api/pagination-item/",
      },
    ],
  },
);
