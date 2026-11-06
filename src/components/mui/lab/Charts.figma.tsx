import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import figma from "@figma/code-connect";

// Sparse chart shells — series/axes come from product data, not Figma properties.

figma.connect(
  BarChart,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=1182%3A11927",
  {
    props: {
      hideLegend: figma.boolean("Legend?", {
        true: undefined,
        false: true,
      }),
    },

    example: ({ hideLegend }) => (
      <BarChart
        height={300}
        series={[{ data: [4, 3, 5] }]}
        xAxis={[{ data: ["A", "B", "C"], scaleType: "band" }]}
        hideLegend={hideLegend}
      />
    ),

    links: [
      {
        name: "MUI Bar Chart",
        url: "https://mui.com/x/react-charts/bars/",
      },
    ],
  },
);

figma.connect(
  LineChart,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=1236%3A8811",
  {
    props: {
      hideLegend: figma.boolean("Legend?", {
        true: undefined,
        false: true,
      }),
    },

    example: ({ hideLegend }) => (
      <LineChart
        height={300}
        series={[{ data: [2, 5, 3] }]}
        xAxis={[{ data: [1, 2, 3] }]}
        hideLegend={hideLegend}
      />
    ),

    links: [
      {
        name: "MUI Line Chart",
        url: "https://mui.com/x/react-charts/lines/",
      },
    ],
  },
);

figma.connect(
  PieChart,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=1182%3A12705",
  {
    example: () => (
      <PieChart
        height={300}
        series={[
          {
            data: [
              { id: 0, value: 10, label: "A" },
              { id: 1, value: 15, label: "B" },
              { id: 2, value: 20, label: "C" },
            ],
          },
        ]}
      />
    ),

    links: [
      {
        name: "MUI Pie Chart",
        url: "https://mui.com/x/react-charts/pie/",
      },
    ],
  },
);

figma.connect(
  ScatterChart,
  "https://www.figma.com/design/3ZH2uUGxYtIItgBpwjz4NC/UAX-DS---Core-Component-Library--Styles--and-Variables?node-id=1182%3A11949",
  {
    example: () => (
      <ScatterChart
        height={300}
        series={[
          {
            data: [
              { x: 1, y: 2, id: 1 },
              { x: 2, y: 5, id: 2 },
              { x: 3, y: 3, id: 3 },
            ],
          },
        ]}
      />
    ),

    links: [
      {
        name: "MUI Scatter Chart",
        url: "https://mui.com/x/react-charts/scatter/",
      },
    ],
  },
);
