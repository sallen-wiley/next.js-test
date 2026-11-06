import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import figma from "@figma/code-connect";

figma.connect(
  DataGrid,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=6603%3A52661",
  {
    props: {
      checkboxSelection: figma.enum("Checkbox", {
        True: true,
        False: undefined,
      }),

      density: figma.enum("Density", {
        Standard: undefined,
        Compact: "compact",
        Comfortable: "comfortable",
      }),
    },

    example: ({ checkboxSelection, density }) => (
      <DataGrid
        rows={[
          { id: 1, name: "Row 1" },
          { id: 2, name: "Row 2" },
        ]}
        columns={[
          { field: "id", headerName: "ID", width: 90 },
          { field: "name", headerName: "Name", flex: 1 },
        ]}
        checkboxSelection={checkboxSelection}
        density={density}
        autoHeight
      />
    ),

    links: [
      {
        name: "MUI Data Grid",
        url: "https://mui.com/x/react-data-grid/",
      },
    ],
  },
);
