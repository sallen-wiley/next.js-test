import React from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import figma from "@figma/code-connect";

figma.connect(
  SimpleTreeView,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6685%3A37208",
  {
    example: () => (
      <SimpleTreeView>
        {/* Check the design: nest TreeItem nodes to match the tree structure. */}
        <TreeItem itemId="1" label="Item" />
      </SimpleTreeView>
    ),

    links: [
      {
        name: "MUI Tree View",
        url: "https://mui.com/x/react-tree-view/",
      },
    ],
  },
);

figma.connect(
  TreeItem,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6601%3A51139",
  {
    props: {
      disabled: figma.enum("Disabled", {
        False: undefined,
        True: true,
      }),
    },

    example: ({ disabled }) => (
      <TreeItem itemId="item" label="Item" disabled={disabled} />
    ),

    links: [
      {
        name: "MUI TreeItem API",
        url: "https://mui.com/x/api/tree-view/tree-item/",
      },
    ],
  },
);
